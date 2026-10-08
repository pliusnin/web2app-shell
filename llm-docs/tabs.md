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
   - the active tab again → `resetToRoot`, the tab's WebView goes to the tab URL;
   - another tab → switch. Every tab has its own WebView and history.
4. Android back button → `tryGoBack` of the active tab: back in its WebView history if possible, otherwise the system handles the press.
5. `renderScene` passes `TabScene` (`ref`, `uri`, `onNavigationStateChange`), so the registry tracks `canGoBack` and controls the WebView.

## How to change

- Add a tab: add `{ title, icon, url }` to `tabs` in `web-app-config.json`. `icon` must be a key of `TAB_ICONS` in `src/widgets/tabs/config/tab-icons.ts`; for a new icon add a key mapped to a Material Design Icons name there.

## Gotchas

- A tab is external when its host differs from the `startUrl` host (`isAppUrlHelper`, [link-routing.md](link-routing.md)). Pressing it opens the URL outside the app.
- An unknown icon key gives a tab without an icon and a dev-only `console.warn`, no crash.
- The native tab bar takes images, not components: icons go through `MaterialDesignIcons.getImageSourceSync`.
- `resetToRoot` navigates with `injectJavaScript` (`window.location.href = ...`) instead of remounting, so the WebView instance stays.
- Colors: active tint is `theme.primary`, background comes from `useSchemeColors`. The inactive tint is set on Android only; iOS keeps the system one.
- `react-native-bottom-tabs` 1.4.0 is patched for the iOS build ([native-build.md](native-build.md)).

## Related

- Android navigation bar matching the tab bar color → [native-build.md](native-build.md)
