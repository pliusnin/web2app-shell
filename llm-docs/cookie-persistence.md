# cookie-persistence

Keeps the user signed in to the site after the system unloads the app: the cookies of all WebViews are saved to the Keychain and put back on the next launch before the first page loads.

## Entry points

- `src/features/cookie-persistence/model/restore-web-view-cookies.helper.ts`: restore on launch, called from `app`.
- `save-web-view-cookies.helper.ts`: save, run by `useCookieSaving` when the app leaves the foreground.
- `track-visited-host.helper.ts`: the page calls it on every navigation.
- `clear-web-view-cookies.helper.ts`: deletes all WebView cookies and the saved copy, for the sign-out from the lock screen ([biometric-login.md](biometric-login.md)).

## Flow

1. Launch, in `useWebViewsReady` (`app`): clear the Keychain after an iOS reinstall, restore the cookies, check the session ([session.md](session.md)). The tabs mount after that or after 5 s, and once the [bundled site](bundled-site.md) is served; the splash stays up meanwhile.
2. Restore: only the cookies the WebView store doesn't have are set.
3. `AppState` `background` or `inactive` → save: Android flush, read without duplicates, write. Expired cookies are dropped on restore.

## Gotchas

- Saving starts only after the restore: earlier it would overwrite the saved cookies with an empty store.
- `inactive` counts: an iOS app swiped away in the app switcher dies without reaching `background`.
- Saves run one after another.
- Android reads cookies only by URL, so on Android the last 50 hosts opened in the WebViews are kept and saved with the cookies. iOS reads all cookies at once and tracks no hosts.
- A cookie without a leading dot in its domain is host-only. It is restored without `domain`: an explicit one widens it to subdomains on Android.
- The iOS Keychain outlives app deletion. `resetSecureStorageAfterInstallHelper` (`shared/lib`) deletes every Keychain item on the first launch after an install, marked in `NSUserDefaults`, which the uninstall wipes.
- Keychain items are readable after the first unlock and stay out of backups and device migration.
- iOS uses the WebKit store (`WEB_VIEW_COOKIE_STORE`), Android has one store for the WebView and the app.

## Related

- WebView setup, page loading → [web-page.md](web-page.md)
