# tabs

Native bottom tabs (`react-native-bottom-tabs`) built from `config.tabs`. Every tab renders its own `WebPageScreen` through the `renderScene` prop from `app`.

## Entry points

- `src/widgets/tabs/ui/tabs-view.tsx`: `TabsView`, the only export.
- `src/widgets/tabs/model/use-tab-navigation.ts`: selected tab, tab presses, Android back.
- `src/widgets/tabs/model/use-tab-web-views.ts`: registry of every tab's WebView by route key.

## Flow

1. `config.tabs` → `mapTabToRouteHelper` → routes with key `tab-<index>`, title, uri, icon and `isExternal`.
2. The first selected tab is `config.startTabIndex` ([config.md](config.md)).
3. Tab press:
   - external tab → `openExternalUrlHelper(uri)`, the selected tab doesn't change (`getPreventsDefault` stops the native switch);
   - the active tab again → `resetToRoot(key, uri)`: the tab gets a new `source` with that `uri` and a higher `version`, and `TabsView` keys the scene by the version, so a fresh WebView loads the tab URL and its history starts over;
   - another tab → switch. Every tab has its own WebView and history.
4. Android back button → `tryGoBack` of the active tab: back in its WebView history if possible, otherwise the system handles the press.
5. `renderScene` passes `TabScene` (`ref`, `uri` from `source(key, uri)`, `onNavigationStateChange`), so the registry tracks `canGoBack` and controls the WebView. `ref(key)` returns the same callback for a key on every render, so React doesn't detach and attach the WebView again.

## How to change

- Add a tab: add `{ title, icon, url }` to `tabs` in `web-app-config.json`. `url` is the page the tab opens (`https://app.example.com/orders`), or a non-web URL (`mailto:`, `tel:`) for an external tab. `icon` is any [Material Design Icons](https://pictogrammers.com/library/mdi/) name, e.g. `home`, `information`, `view-grid`.

## Gotchas

- Every tab with an http(s) URL opens in its WebView, whatever the site. A tab with a non-web URL is external (`getOriginHelper` gives no origin): pressing it opens the URL outside the app. Links inside a tab stay in the app only on the tab URL's origin ([link-routing.md](link-routing.md)).
- `getTabIconHelper` checks the name against the library glyph map (`glyphmaps/MaterialDesignIcons.json`) with `Object.hasOwn`, so `constructor` and other prototype keys don't pass. An unknown name gives a tab without an icon and a dev-only `console.warn`; the library itself would draw a `?` glyph.
- The native tab bar takes images, not components: icons go through `MaterialDesignIcons.getImageSourceSync`.
- The active tab shows the icon from the config, the inactive ones its `-outline` variant (`getOutlineTabIconHelper`). An icon without one (`jira`, `dev-to`) shows the same image in both states.
- `resetToRoot` remounts the WebView instead of navigating it: react-native-webview has no method to load a URL, and passing the same `source.uri` again doesn't reload the page. The remount is a full page load.
- Colors: active tint is `theme.primary`, background comes from `useSchemeColors`. The inactive tint is set on Android only; iOS keeps the system one.
- `react-native-bottom-tabs` 1.4.0 is patched for the iOS build ([native-build.md](native-build.md)).

## Related

- Android navigation bar matching the tab bar color → [native-build.md](native-build.md)
