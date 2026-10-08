# cookie-persistence

Keeps the user signed in to the site after the app is killed. Native only, no JS: the WebView keeps its default persistent store (`incognito` off, `cacheEnabled` on, both library defaults).

## Entry points

- `ios/web2appShell/SessionCookieStore.swift`: saves and restores session cookies of `WKWebsiteDataStore.default()`.
- `ios/web2appShell/SceneDelegate.swift`: starts React Native only after `SessionCookieStore.shared.restore`.
- `android/app/src/main/java/com/web2appshell/MainActivity.kt`: `CookieManager.flush()` in `onPause`.

## iOS flow

1. On scene connect, `restore` reads `Application Support/session-cookies.plist` and puts back the cookies the store doesn't have. Then React Native starts and the first page loads with them. The launch screen stays up meanwhile.
2. `restore` then adds a `WKHTTPCookieStoreObserver`. On every cookie change it rewrites the snapshot with all session-only cookies of the store.

## Gotchas

- Only session cookies are saved. WebKit persists cookies with an expiry itself but drops session ones with the process.
- A saved cookie never overwrites one the store already has: the snapshot may be older, e.g. a rotated refresh token.
- Logout: the observer also fires on deletion, so a cookie the site removed leaves the snapshot. This covers XHR logouts that never trigger `onLoadEnd`.
- A snapshot not rewritten for 30 days (`maxAge`) is ignored.
- `restore` gives up after 1 s (`restoreTimeout`) so a stuck cookie store can't keep the app on the launch screen.
- The snapshot lives in the app sandbox, not the Keychain: the Keychain survives app deletion and would sign the user in after a reinstall.
- `HttpOnly` round-trips through the undocumented `HttpOnly` key of `HTTPCookie.properties`.
- Android needs no snapshot: its WebView keeps session cookies across launches. It writes them to disk on a timer, so the flush in `onPause` saves a login done right before the app is killed. `react-native-webview` also flushes in `onPageFinished`.
- The code lives in the host app, not in `src/`. Moving `src/` to a package means moving it to the package's native part.

## Related

- WebView setup, page loading → [web-page.md](web-page.md)
- Native project layout → [native-build.md](native-build.md)
