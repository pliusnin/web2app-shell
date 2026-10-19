# Architecture

A React Native shell that turns a website into a native app: the site ships inside the app as a zip and is served locally, native bottom tabs show its pages, a WebView per tab, push notifications. The host app passes a JSON config; the shell lives in the local package `packages/web2app-shell` → [package.md](package.md).

## Host and public API

- `App.tsx` imports `web-app-config.json` and renders `<WebAppShell config={...} />` from `web2app-shell`.
- `src/index.ts` is the package API: `WebAppShell`, `type AppConfig` and `type CheckSession` (the optional `checkSession` prop, [session.md](session.md)), nothing else.
- `index.js` only registers `App`.

## Layer map

| Layer      | Slice / segment      | Role                                                                                            | Doc                                            |
| ---------- | -------------------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `app`      | `entrypoint`         | providers, app-wide hooks, composition                                                          | below                                          |
| `pages`    | `web-page`           | the screen of every tab: WebView, bridge commands, splash                                       | [web-page.md](web-page.md)                     |
| `widgets`  | `tabs`               | native bottom tabs, per-tab WebView control                                                     | [tabs.md](tabs.md)                             |
| `features` | `bundled-site`       | unpacks the site from the zip and serves it locally                                             | [bundled-site.md](bundled-site.md)             |
| `features` | `link-routing`       | in-app vs external links                                                                        | [link-routing.md](link-routing.md)             |
| `features` | `push-notifications` | FCM + notify-kit                                                                                | [push-notifications.md](push-notifications.md) |
| `features` | `offline-toast`      | toast when the connection drops                                                                 | [offline-toast.md](offline-toast.md)           |
| `features` | `cookie-persistence` | WebView cookies in the Keychain between launches                                                | [cookie-persistence.md](cookie-persistence.md) |
| `features` | `session`            | session token check before the first page                                                       | [session.md](session.md)                       |
| `shared`   | `bridge`             | site ↔ app contract, the in-page script                                                         | [bridge.md](bridge.md)                         |
| `shared`   | `config`             | config types, `resolveConfig`, `ConfigProvider` / `useConfig`, `SITE_ORIGIN`, `COLORS`, `TEXTS` | [config.md](config.md)                         |
| `shared`   | `lib`, `ui`          | generic hooks, helpers, components                                                              | below                                          |

## Composition

`src/app/entrypoint/web-app-shell.tsx`:

1. `resolveConfig(config)` in `useMemo` → `ConfigProvider`.
2. `useWebViewsReady` (`app/entrypoint`): `true` once the bundled site is served ([bundled-site.md](bundled-site.md)) and, at the latest after 5 s, the Keychain reset after an iOS reinstall → cookie restore → session check have run. It also turns cookie saving on.
3. App-wide hooks: `useOfflineToast`, `usePushNotifications`.
4. `SafeAreaProvider` → `SafeAreaView` with the scheme background → `<TabsView renderScene={scene => <WebPageScreen {...scene} />} />` once the WebViews are ready.
5. `ToastHost` after the tabs, so toasts are drawn on top.

`widgets` can't import `pages`, so the page reaches the tabs through the `renderScene` render prop. The page gets only `TabScene` (`ref`, `uri`, `onNavigationStateChange`) and must not know it is shown in a tab.

## Shared modules

Check this list before writing a new helper.

`src/shared/lib`:

- `getHostHelper`: lowercased host of an http(s) URL, `undefined` for `tel:`, `mailto:` and other non-web URLs.
- `mergeRefsHelper`: one ref callback for several refs.
- `hideSplashHelper`: fades out the native boot splash.
- `readSecureItemHelper`, `writeSecureItemHelper`, `clearSecureItemHelper`: JSON per service in the Keychain, readable after the first unlock, kept out of backups.
- `resetSecureStorageAfterInstallHelper`: deletes the Keychain items left by a previous iOS install.
- `useAndroidBackHandler`: hardware back subscription that always calls the latest handler.
- `useConnectionLost`: calls the handler on a real online → offline change only, not when the app starts offline or while NetInfo doesn't know yet.
- `useSchemeColors`: background and foreground for the system light/dark scheme.
- `web-view.types.ts`: `WebViewControls` and typed WebView handler props.

`src/shared/ui`:

- `ToastHost`: `react-native-toast-message` host offset by the top safe-area inset. Features show toasts with `Toast.show`.
