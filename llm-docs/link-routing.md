# link-routing

Decides which URLs the WebView loads and which open outside the app: browser, phone, mail or another app. Used by the page for WebView navigation and by the tabs for external tabs.

## Entry points

- `src/features/link-routing/model/route-link-request.helper.ts`: `routeLinkRequestHelper`, the `onShouldStartLoadWithRequest` handler for the WebView.
- `isAppUrlHelper(url)`: whether the URL is a page of the bundled site.
- `openExternalUrlHelper(url)`: opens a URL outside the app.

## Flow

1. The WebView calls `onShouldStartLoadWithRequest` before a navigation.
2. `shouldLoadInAppHelper`: iOS sub-frame requests (`isTopFrame` false) always load; everything else goes through `isAppUrlHelper`.
3. App URL → `true`, the WebView loads it. Otherwise → `openExternalUrlHelper(url)` and `false`, the WebView stays on the current page.
4. `openExternalUrlHelper` calls `Linking.openURL`; when no app can open the URL it shows an alert (`TEXTS.cantOpenLink*`).

## Contracts

- The app's pages are the ones on `SITE_ORIGIN` (`http://127.0.0.1:3035`), the local server of the [bundled site](bundled-site.md). The origin must match exactly, port included. Non-web URLs (`tel:`, `mailto:`) never match.

## Gotchas

- Android reports the bare origin (`http://127.0.0.1:3035`, no slash) as the URL of a bridge message, so it matches too.
- Android waits for the `onShouldStartLoadWithRequest` answer only 250 ms, so the external URL is opened without awaiting.
- iOS asks about iframe loads too (maps, analytics). They must stay inside the page, hence the `isTopFrame` check.
- The iOS simulator resolves `tel:` to `false` instead of failing, so the "can't open" alert shows there.
- Android still reports WebView error `-10` for blocked app links; its error page is prevented in [web-page.md](web-page.md).
