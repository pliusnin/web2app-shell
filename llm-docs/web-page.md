# web-page

The screen of every tab: a WebView of the [bundled site](bundled-site.md) wired to the [bridge](bridge.md). It doesn't know it is shown in a tab; the tab wiring comes in as `TabScene` props.

## Entry points

- `src/pages/web-page/ui/web-page-screen.tsx`: `WebPageScreen`, the only export. Wires everything below to the WebView.
- `src/pages/web-page/model/bridge/use-bridge-messages.ts`: the commands of the bridge, see [bridge.md](bridge.md).
- `src/pages/web-page/model/process-recovery/use-web-view-recovery.ts`: a new WebView after its process is gone.
- `src/pages/web-page/model/load-error/handle-load-error.helper.ts`: a failed load.
- `model/native-fetch`, `model/file-download`, `model/biometric-login`: what the bridge commands do; biometrics itself is in `features/biometric-login` ([biometric-login.md](biometric-login.md)).

## Flow

1. `WEB_READY` (sent by the site's bridge file) → `hideSplashHelper` fades out the native splash.
2. A failed load → the WebView's own error page, and the splash hides: a failed page never sends `WEB_READY`.
3. The WebView's content process is gone (`onContentProcessDidTerminate`, `onRenderProcessGone`) → a new WebView (`key`) opens the last URL.
4. `DOWNLOAD_FILE` → `readFileUrlHelper` takes the file from `url`: a base64 `data:` URL is decoded in place, an http(s) URL is downloaded by the app with React Native's `fetch` (no cookies of the WebView on iOS, a non-2xx status is a failure) and its type comes from `Content-Type`. The file goes to `cache/downloads` under the site's name (unsafe characters removed, the extension added by type when missing) and opens in Quick Look on iOS or an app for the type on Android. A failure shows a toast.

## Contracts

- `TabScene` props from [tabs.md](tabs.md): `ref` (merged with the page's own ref by `mergeRefsHelper`), `uri`, `onNavigationStateChange`.
- `injectedJavaScriptBeforeContentLoaded` is `BRIDGE_SCRIPT`, `window.__MG_Native` for the site ([bridge.md](bridge.md)).
- `onShouldStartLoadWithRequest` is `routeLinkRequestHelper` ([link-routing.md](link-routing.md)).
- Every navigation goes to `trackVisitedHostHelper` ([cookie-persistence.md](cookie-persistence.md)).

## Gotchas

- The site is served locally, so a page always loads: there are no offline or HTTP error screens. Requests of the site to its APIs fail inside the site; the [offline toast](offline-toast.md) tells about the connection.
- `originWhitelist={['*']}` sends every navigation, `tel:` and `mailto:` included, through `onShouldStartLoadWithRequest`. With the default whitelist the OS would open non-http links itself, bypassing link routing.
- Android reports error `-10` (unknown URL scheme) for `tel:`, `mailto:` and other app links even after `onShouldStartLoadWithRequest` blocked them and opened them outside. `handleLoadErrorHelper` prevents the error page for it.
- The splash doesn't wait for `onLoadEnd`: a page is loaded before the site has drawn anything, which shows a blank screen. Tabs mount lazily, so on launch only the start tab's page can hide it.
- `allowsBackForwardNavigationGestures` gives iOS swipe-back inside the WebView. The Android back button is handled by the tabs ([tabs.md](tabs.md)).
- The WebView can't download files the site makes in the browser (`blob:`), and the app can't read a `blob:` URL either: the site's bridge file turns such a file into a base64 `data:` URL and hands it over with `DOWNLOAD_FILE` ([bridge.md](bridge.md)).

## Related

- Splash assets and native splash setup → [native-build.md](native-build.md)
