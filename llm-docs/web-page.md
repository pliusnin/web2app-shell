# web-page

The screen of every tab: a WebView with a progress bar, an error overlay and splash hiding. It doesn't know it is shown in a tab; the tab wiring comes in as `TabScene` props.

## Entry points

- `src/pages/web-page/ui/web-page-screen.tsx`: `WebPageScreen`, the only export. Wires everything below to the WebView.
- `src/pages/web-page/model/page-load/use-page-load.ts`: load state, WebView handlers, retry, auto-reload.
- `src/pages/web-page/model/page-load/page-load-reducer.ts`: state transitions.

## Flow

1. `onLoadStart` → loading, progress 0 → `ProgressBar` in `theme.primary` over the top edge.
2. `onLoadProgress` → progress.
3. `onLoadEnd` → page shown (`hasShownPage`), error cleared.
4. `onError` → `classifyLoadErrorHelper`:
   - `network` → offline error screen. When `useNetworkChange` reports online again, the page reloads by itself.
   - `ignored` → nothing, see Gotchas.
   - `other` → left to the WebView.
5. `onHttpError` → `getHttpErrorActionHelper`:
   - status below 500 → error screen with the status;
   - 5xx before any page was shown → toast, stop loading, error screen;
   - 5xx after a page was shown → toast, stop loading, the current page stays.
6. `PageErrorOverlay` covers the WebView with `ErrorScreen`; Retry reloads the WebView.
7. `useHideSplash` hides the native splash once the page or an error screen is on screen, or right away when the device is offline.

## Contracts

- `TabScene` props from [tabs.md](tabs.md): `ref` (merged with the page's own ref by `mergeRefsHelper`), `uri`, `onNavigationStateChange`.
- `onShouldStartLoadWithRequest` comes from `useLinkRouting` ([link-routing.md](link-routing.md)).

## Gotchas

- `originWhitelist={['*']}` sends every navigation, `tel:` and `mailto:` included, through `onShouldStartLoadWithRequest`. With the default whitelist the OS would open non-http links itself, bypassing link routing.
- The WebView sends `onLoadEnd` after a failed or stopped load too. The reducer ignores it when nothing is loading, otherwise it would clear the error.
- Network error codes differ per platform: Android `WebViewClient` codes, iOS `NSURLErrorDomain` codes. Both lists are in `classify-load-error.helper.ts`.
- Android reports error `-10` (unknown URL scheme) for `tel:`, `mailto:` and other app links even after `onShouldStartLoadWithRequest` blocked them and opened them outside. It is classified as `ignored`.
- The offline error screen appears only when a load fails. If the connection drops after the page loaded, the page stays and only the offline toast shows ([offline-toast.md](offline-toast.md)).
- `allowsBackForwardNavigationGestures` gives iOS swipe-back inside the WebView. The Android back button is handled by the tabs ([tabs.md](tabs.md)).
- `ProgressBar` is a JS component on purpose ([native-build.md](native-build.md)).

## Related

- Splash assets and native splash setup → [native-build.md](native-build.md)
