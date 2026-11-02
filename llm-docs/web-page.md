# web-page

The screen of every tab: a WebView of the [bundled site](bundled-site.md) wired to the [bridge](bridge.md). It doesn't know it is shown in a tab; the tab wiring comes in as `TabScene` props.

## Entry points

- `src/pages/web-page/ui/web-page-screen.tsx`: `WebPageScreen`, the only export. Wires everything below to the WebView.
- `src/pages/web-page/model/bridge/use-bridge-messages.ts`: the commands of the bridge, see [bridge.md](bridge.md).
- `src/pages/web-page/model/process-recovery/use-web-view-recovery.ts`: a new WebView after its process is gone.
- `src/pages/web-page/model/load-error/handle-load-error.helper.ts`: a failed load.
- `src/pages/web-page/model/local-storage-watch/use-local-storage-watch.ts`: reports whether a localStorage key has a value, see below.
- `model/native-fetch`, `model/file-download`, `model/biometric-login`: what the bridge commands do; biometrics itself is in `features/biometric-login` ([biometric-login.md](biometric-login.md)).

## Flow

1. `WEB_READY` (sent by the site's bridge file) → `hideSplashHelper` fades out the native splash.
2. A failed load → the WebView's own error page, and the splash hides: a failed page never sends `WEB_READY`.
3. The WebView's content process is gone (`onContentProcessDidTerminate`, `onRenderProcessGone`) → a new WebView (`key`) opens the last URL.
4. `DOWNLOAD_FILE` → `readFileUrlHelper` takes the file from `url`: a base64 `data:` URL is decoded in place, an http(s) URL is downloaded by the app with React Native's `fetch` (no cookies of the WebView on iOS, a non-2xx status is a failure) and its type comes from `Content-Type`. The file goes to `cache/downloads` under the site's name (unsafe characters removed, the extension added by type when missing) and opens in Quick Look on iOS or an app for the type on Android. A failure shows a toast.

## Contracts

- `TabScene` props from [tabs.md](tabs.md): `ref` (merged with the page's own ref by `mergeRefsHelper`), `uri`, `onNavigationStateChange`, `localStorageKey`, `onLocalStorageKeyChange`.
- `injectedJavaScriptBeforeContentLoaded`, `injectedJavaScript` and `onMessage` come from `useLocalStorageWatch`, set only with a `localStorageKey`.
- `onShouldStartLoadWithRequest` is `routeLinkRequestHelper` ([link-routing.md](link-routing.md)).
- Every navigation goes to `trackVisitedHostHelper` ([cookie-persistence.md](cookie-persistence.md)).

## localStorage watch

With `localStorageKey` (the tab bar's `authToken`, [tabs.md](tabs.md#hidden-tab-bar-while-signed-out)) the page reports whether that key has a non-empty value. The page doesn't know what the key means.

1. `createLocalStorageWatchScriptHelper(key)` builds the script, injected before the content loads and again after the load. The first run wraps `Storage.prototype.setItem`, `removeItem` and `clear` and listens to `storage` events; a later run on the same page only reports.
2. The script posts `{ cmd: 'LOCAL_STORAGE_KEY', args: { hasValue } }` on its first run and whenever `hasValue` changes, not on every write.
3. `parseLocalStorageMessageHelper` drops messages whose `nativeEvent.url` fails `isAppUrlHelper` against the tab URL ([link-routing.md](link-routing.md)) and anything else the page posts; `onLocalStorageKeyChange(hasValue)` gets the rest.

Gotchas:

- The script is a string: Hermes keeps no function source to `toString()`. `tsc` and ESLint don't check it, its test runs it against a fake page. Keep it in plain browser JS.
- Android (react-native-webview 14) injects the early script in `onPageStarted`, where it can land in the previous document and be lost; the run after the load installs it then.
- `window.ReactNativeWebView` exists only while `onMessage` is set, so the WebView gets `onMessage` only together with the script.
- iOS fails an injected script whose last value can't be serialized: the script ends with `true;`.

## Gotchas

- The site is served locally, so a page always loads: there are no offline or HTTP error screens. Requests of the site to its APIs fail inside the site; the [offline toast](offline-toast.md) tells about the connection.
- `originWhitelist={['*']}` sends every navigation, `tel:` and `mailto:` included, through `onShouldStartLoadWithRequest`. With the default whitelist the OS would open non-http links itself, bypassing link routing.
- Android reports error `-10` (unknown URL scheme) for `tel:`, `mailto:` and other app links even after `onShouldStartLoadWithRequest` blocked them and opened them outside. `handleLoadErrorHelper` prevents the error page for it.
- The splash doesn't wait for `onLoadEnd`: a page is loaded before the site has drawn anything, which shows a blank screen. Tabs mount lazily, so on launch only the start tab's page can hide it.
- `allowsBackForwardNavigationGestures` gives iOS swipe-back inside the WebView. The Android back button is handled by the tabs ([tabs.md](tabs.md)).
- The WebView can't download files the site makes in the browser (`blob:`), and the app can't read a `blob:` URL either: the site's bridge file turns such a file into a base64 `data:` URL and hands it over with `DOWNLOAD_FILE` ([bridge.md](bridge.md)).

## Related

- Splash assets and native splash setup → [native-build.md](native-build.md)
