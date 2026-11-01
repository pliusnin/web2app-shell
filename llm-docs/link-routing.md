# link-routing

Decides which URLs the WebView loads and which open outside the app: browser, phone, mail or another app. Used by the page for WebView navigation.

## Entry points

- `src/features/link-routing/model/route-link-request.helper.ts`: `routeLinkRequestHelper(request, tabUrl)`, the `onShouldStartLoadWithRequest` handler for the WebView of a tab.
- `isAppUrlHelper(url, tabUrl)`: whether the URL is a page of the tab's site.
- `openExternalUrlHelper(url)`: opens a URL outside the app.

## Flow

1. The WebView calls `onShouldStartLoadWithRequest` before a navigation.
2. `shouldLoadInAppHelper`: iOS sub-frame requests (`isTopFrame` false) always load; everything else goes through `isAppUrlHelper` with the tab URL the page was opened with.
3. App URL → `true`, the WebView loads it. Otherwise → `openExternalUrlHelper(url)` and `false`, the WebView stays on the current page.
4. `openExternalUrlHelper` calls `Linking.openURL`; when no app can open the URL it shows an alert (`TEXTS.cantOpenLink*`).

## Contracts

- A tab's pages are the ones on the origin of its URL from the config (`getOriginHelper`: scheme, host and port, lowercased). The origin must match exactly, so another port, scheme or subdomain is another site. Non-web URLs (`tel:`, `mailto:`) never match.
- Each tab routes by its own URL: a tab on `https://app.example.com` keeps `https://app.example.com/*` inside and sends `https://example.com` outside.

## Gotchas

- Android waits for the `onShouldStartLoadWithRequest` answer only 250 ms, so the external URL is opened without awaiting.
- iOS asks about iframe loads too (maps, analytics). They must stay inside the page, hence the `isTopFrame` check.
- The iOS simulator resolves `tel:` to `false` instead of failing, so the "can't open" alert shows there.
- Android still reports WebView error `-10` for blocked app links; its error page is prevented in [web-page.md](web-page.md).
