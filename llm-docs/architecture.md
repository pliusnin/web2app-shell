# Architecture

A React Native shell that wraps a website into a native app: native bottom tabs, a WebView per tab, push notifications. The host app passes a JSON config; the shell lives in `src/` and is going to become a separate package.

## Host and public API

- `App.tsx` imports `web-app-config.json` and renders `<WebAppShell config={...} />`.
- `src/index.ts` is the future package API: `WebAppShell` and `type AppConfig`, nothing else.
- `index.js` only registers `App`.

## Layer map

| Layer      | Slice / segment      | Role                                                                             | Doc                                            |
| ---------- | -------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------- |
| `app`      | `entrypoint`         | providers, app-wide hooks, composition                                           | below                                          |
| `pages`    | `web-page`           | the screen of every tab: WebView, load state, errors, splash                     | [web-page.md](web-page.md)                     |
| `widgets`  | `tabs`               | native bottom tabs, per-tab WebView control                                      | [tabs.md](tabs.md)                             |
| `features` | `link-routing`       | in-app vs external links                                                         | [link-routing.md](link-routing.md)             |
| `features` | `push-notifications` | FCM + notify-kit                                                                 | [push-notifications.md](push-notifications.md) |
| `features` | `offline-toast`      | toast when the connection drops                                                  | [offline-toast.md](offline-toast.md)           |
| `shared`   | `config`             | config types, `resolveConfig`, `ConfigProvider` / `useConfig`, `COLORS`, `TEXTS` | [config.md](config.md)                         |
| `shared`   | `lib`, `ui`          | generic hooks, helpers, components                                               | below                                          |

## Composition

`src/app/entrypoint/web-app-shell.tsx`:

1. `resolveConfig(config)` in `useMemo` → `ConfigProvider`.
2. App-wide hooks: `useOfflineToast`, `useNotificationsSetup`, `useForegroundNotifications`.
3. `SafeAreaProvider` → `SafeAreaView` with the scheme background → `<TabsView renderScene={scene => <WebPageScreen {...scene} />} />`.
4. `ToastHost` after the tabs, so toasts are drawn on top.

`widgets` can't import `pages`, so the page reaches the tabs through the `renderScene` render prop. The page gets only `TabScene` (`ref`, `uri`, `onNavigationStateChange`) and must not know it is shown in a tab.

## Shared modules

Check this list before writing a new helper.

`src/shared/lib`:

- `getHostHelper`: lowercased host of an http(s) URL, `undefined` for `tel:`, `mailto:` and other non-web URLs.
- `mergeRefsHelper`: one ref callback for several refs.
- `hideSplashHelper`: fades out the native boot splash.
- `useAndroidBackHandler`: hardware back subscription that always calls the latest handler.
- `useNetworkStatus`: `isOnline` is `true` / `false`, `null` while unknown.
- `useNetworkChange`: `onOffline` / `onOnline` on real changes only, not on the first known status.
- `useSchemeColors`: background and foreground for the system light/dark scheme.
- `web-view.types.ts`: `WebViewControls` and typed WebView handler props.

`src/shared/ui`:

- `ProgressBar`: JS progress bar, see [native-build.md](native-build.md) for why it isn't native.
- `ToastHost`: `react-native-toast-message` host offset by the top safe-area inset. Features show toasts with `Toast.show`.
