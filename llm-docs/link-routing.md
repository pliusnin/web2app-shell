# link-routing

Decides which URLs the WebView loads and which open outside the app: browser, phone, mail or another app. Used by the page for WebView navigation and by the tabs for external tabs.

## Entry points

- `src/features/link-routing/model/use-link-routing.ts`: `useLinkRouting()`, the `onShouldStartLoadWithRequest` handler for the WebView.
- `isAppUrlHelper(url, startUrl)`: the app-domain rule.
- `openExternalUrlHelper(url)`: opens a URL outside the app.

## Flow

1. The WebView calls `onShouldStartLoadWithRequest` before a navigation.
2. `shouldLoadInAppHelper`: iOS sub-frame requests (`isTopFrame` false) always load; everything else goes through `isAppUrlHelper`.
3. App URL → `true`, the WebView loads it. Otherwise → `openExternalUrlHelper(url)` and `false`, the WebView stays on the current page.
4. `openExternalUrlHelper` calls `Linking.openURL`; when no app can open the URL it shows an alert (`TEXTS.cantOpenLink*`).

## Contracts

- App domain is the host of `config.startUrl` ([config.md](config.md)). Hosts are compared exactly and lowercased; scheme (http/https), port and path don't matter. Non-web URLs (`tel:`, `mailto:`) never match.

## Gotchas

- Exact host match is a deliberate decision: `www.` and other subdomains of the `startUrl` host open outside. Don't add subdomain handling or allow-lists unless asked.
- Android waits for the `onShouldStartLoadWithRequest` answer only 250 ms, so the external URL is opened without awaiting.
- iOS asks about iframe loads too (reCAPTCHA, analytics). They must stay inside the page, hence the `isTopFrame` check.
- The iOS simulator resolves `tel:` to `false` instead of failing, so the "can't open" alert shows there.
- Android still reports WebView error `-10` for blocked app links; it is ignored in [web-page.md](web-page.md).
