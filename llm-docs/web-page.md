# web-page

The screen of every tab: a WebView of the [bundled site](bundled-site.md) wired to the [bridge](bridge.md). It doesn't know it is shown in a tab; the tab wiring comes in as `TabScene` props.

## Entry points

- `src/pages/web-page/ui/web-page-screen.tsx`: `WebPageScreen`, the only export. Wires everything below to the WebView.
- `src/pages/web-page/model/bridge/use-bridge-messages.ts`: the commands of the bridge, see [bridge.md](bridge.md).
- `src/pages/web-page/model/process-recovery/use-web-view-recovery.ts`: a new WebView after its process is gone.
- `src/pages/web-page/model/load-error/handle-load-error.helper.ts`: a failed load.
- `src/pages/web-page/ui/load-error-view.tsx`: `LoadErrorView`, the screen of a failed load with a retry button.
- `src/pages/web-page/model/splash/use-splash-hide.ts`: hides the native splash.
- `src/pages/web-page/model/injected-scripts/join-scripts.helper.ts`: one post-load script out of the host app's and the page's own.
- `src/pages/web-page/model/local-storage-watch/use-local-storage-watch.ts`: reports whether a localStorage key has a value, see below.
- `src/pages/web-page/model/file-download/use-file-download.ts`: saves and opens a file the page sends with `DOWNLOAD_FILE`, see the flow below.
- `src/pages/web-page/model/messages/join-message-handlers.helper.ts`: one `onMessage` for the localStorage watch and the file download.
- `model/biometric-login`: not wired to the page; biometrics itself is in `features/biometric-login` ([biometric-login.md](biometric-login.md)).

## Flow

1. The page has finished loading (`onLoadEnd`, a failed load included) → `useSplashHide` fades out the native splash. A page that is still loading after 8 seconds loses the splash too.
2. A failed load → `LoadErrorView` over the page (`renderError`): a message and a "Try again" button that reloads the WebView.
3. The WebView's content process is gone (`onContentProcessDidTerminate`, `onRenderProcessGone`) → a new WebView (`key`) opens the last URL.
4. The page posts `{ cmd: 'DOWNLOAD_FILE', args: { fileName, url } }` with `window.ReactNativeWebView.postMessage`, `url` being a base64 `data:` URL of the file (the site reads its `Blob` with `FileReader.readAsDataURL`). `parseDownloadMessageHelper` drops messages of other origins, `openDownloadedFileHelper` writes the file to `cache/downloads` under the site's name (unsafe characters and leading dots removed, the extension added by type when missing) and opens it in Quick Look on iOS or an app for the type on Android, where the user saves or shares it. Any other `url` (http, `blob:`) or a failure shows the "Couldn't open the file" toast: the app downloads nothing by itself.

## Contracts

- `TabScene` props from [tabs.md](tabs.md): `ref` (merged with the page's own ref by `mergeRefsHelper`), `uri`, `onNavigationStateChange`, `localStorageKey`, `onLocalStorageKeyChange`.
- `injectedJavaScriptBeforeContentLoaded` and `onMessage` come from `useLocalStorageWatch`, set only with a `localStorageKey`. `injectedJavaScript` is the host app's `customInjectJavascript` followed by the watch script, joined by `joinScriptsHelper`; unset when there is neither. Never build it with a template string: a missing part becomes the word `undefined` and the script throws.
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
- `window.ReactNativeWebView` exists only while `onMessage` is set. The WebView always gets `onMessage` (file download), so the object is there on every page.
- iOS fails an injected script whose last value can't be serialized: the script ends with `true;`.

## Gotchas

- iOS draws the native tab bar over the tab's content. `contentInsetAdjustmentBehavior="automatic"` makes the WebView's scroll view inset its content by the tab bar's height, which follows the bar when it hides ([tabs.md](tabs.md#hidden-tab-bar-while-signed-out)). react-native-webview defaults to `"never"`, which leaves the bottom of every page under the bar. The inset is native, so `position: fixed` bottom elements of the site still need `viewport-fit=cover` and `env(safe-area-inset-bottom)` on the site's side. Android lays the tab bar out below the page and ignores the prop.
- The site is served locally, so a page always loads: there are no offline or HTTP error screens. Requests of the site to its APIs fail inside the site; the [offline toast](offline-toast.md) tells about the connection.
- `originWhitelist={['*']}` sends every navigation, `tel:` and `mailto:` included, through `onShouldStartLoadWithRequest`. With the default whitelist the OS would open non-http links itself, bypassing link routing.
- Android reports error `-10` (unknown URL scheme) for `tel:`, `mailto:` and other app links even after `onShouldStartLoadWithRequest` blocked them and opened them outside. `handleLoadErrorHelper` prevents the error page for it.
- The splash hides on `onLoadEnd`: a remote site has no bridge file to send `WEB_READY`. Tabs mount lazily, so on launch only the start tab's page can hide it. The host app must call `RNBootSplash.init` natively ([native-build.md](native-build.md)); without it there is no splash to hide and the page shows up half-loaded.
- `allowsBackForwardNavigationGestures` gives iOS swipe-back inside the WebView. The Android back button is handled by the tabs ([tabs.md](tabs.md)).
- The WebView can't download files the site makes in the browser (`blob:`, an `<a download>` click): link routing treats the `blob:` URL as an external link and shows "Can't open the link". The app can't read a `blob:` URL either, so the site itself turns the file into a base64 `data:` URL and hands it over with `DOWNLOAD_FILE`.

## Related

- Splash assets and native splash setup → [native-build.md](native-build.md)
