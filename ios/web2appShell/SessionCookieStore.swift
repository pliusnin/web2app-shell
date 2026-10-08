import WebKit

/// Keeps WKWebView session cookies across launches. WebKit persists cookies
/// with an expiry itself but drops session-only ones with the process,
/// which logs the user out of sites that keep auth in them.
final class SessionCookieStore: NSObject, WKHTTPCookieStoreObserver {
  static let shared = SessionCookieStore()

  private static let maxAge: TimeInterval = 30 * 24 * 60 * 60
  private static let restoreTimeout: TimeInterval = 1

  private let cookieStore = WKWebsiteDataStore.default().httpCookieStore
  private let fileURL = FileManager.default
    .urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
    .appendingPathComponent("session-cookies.plist")

  /// Puts saved session cookies back before the first page load, then starts
  /// tracking changes. `completion` runs once, at the latest after the timeout.
  func restore(completion: @escaping () -> Void) {
    var isFinished = false
    let finish = {
      guard !isFinished else { return }
      isFinished = true
      self.cookieStore.add(self)
      completion()
    }
    DispatchQueue.main.asyncAfter(deadline: .now() + Self.restoreTimeout, execute: finish)

    let saved = readSnapshot()
    cookieStore.getAllCookies { existing in
      // Never overwrite a cookie WebKit already has: the snapshot may be older,
      // e.g. a rotated refresh token.
      let existingKeys = Set(existing.map(Self.key))
      let group = DispatchGroup()
      saved.filter { !existingKeys.contains(Self.key($0)) }.forEach { cookie in
        group.enter()
        self.cookieStore.setCookie(cookie) { group.leave() }
      }
      group.notify(queue: .main, execute: finish)
    }
  }

  // Fires on deletion too, so a logout leaves the snapshot without the cookie.
  func cookiesDidChange(in cookieStore: WKHTTPCookieStore) {
    cookieStore.getAllCookies { cookies in
      self.writeSnapshot(cookies.filter(\.isSessionOnly))
    }
  }

  private static func key(_ cookie: HTTPCookie) -> String {
    "\(cookie.name)|\(cookie.domain)|\(cookie.path)"
  }

  private func writeSnapshot(_ cookies: [HTTPCookie]) {
    let snapshot: [String: Any] = [
      "savedAt": Date(),
      "cookies": cookies.compactMap { cookie in
        cookie.properties.map { Dictionary(uniqueKeysWithValues: $0.map { ($0.key.rawValue, $0.value) }) }
      },
    ]
    guard let data = try? PropertyListSerialization.data(
      fromPropertyList: snapshot, format: .binary, options: 0
    ) else { return }
    try? FileManager.default.createDirectory(
      at: fileURL.deletingLastPathComponent(), withIntermediateDirectories: true
    )
    try? data.write(to: fileURL, options: [.atomic, .completeFileProtectionUntilFirstUserAuthentication])
  }

  private func readSnapshot() -> [HTTPCookie] {
    guard
      let data = try? Data(contentsOf: fileURL),
      let snapshot = try? PropertyListSerialization.propertyList(from: data, format: nil) as? [String: Any],
      let savedAt = snapshot["savedAt"] as? Date,
      Date().timeIntervalSince(savedAt) < Self.maxAge,
      let cookies = snapshot["cookies"] as? [[String: Any]]
    else { return [] }

    return cookies.compactMap { properties in
      HTTPCookie(properties: Dictionary(uniqueKeysWithValues: properties.map {
        (HTTPCookiePropertyKey($0.key), $0.value)
      }))
    }
  }
}
