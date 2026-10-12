# Config

The host app configures the shell with one JSON file. Types and resolution live in `src/shared/config`.

## Entry points

- `web-app-config.json`: the config of this app, imported by `App.tsx`.
- `src/shared/config/app-config.types.ts`: `AppConfig` (input) and `ResolvedConfig` (what the app reads).
- `src/shared/config/resolve-config.ts`: `resolveConfig`, `AppConfig` → `ResolvedConfig`.
- `useConfig()`: the resolved config in any component; throws outside `ConfigProvider`.

## Schema

| Key               | Required | Meaning                                                                            |
| ----------------- | -------- | ---------------------------------------------------------------------------------- |
| `tabs[]`          | yes      | `{ title, icon, url }` per bottom tab, see [tabs.md](tabs.md)                      |
| `theme.primary`   | yes      | active tab tint, progress bar, error screen button                                 |
| `startUrl`        | no       | which tab opens first; its host is the app domain. Defaults to the first tab's URL |
| `userAgentSuffix` | no       | passed to the WebView as `applicationNameForUserAgent`, appended to the user agent |
| `splash`          | no       | `{ logo, background, logoWidth? }` for the native boot splash, see below           |

## Flow

`resolveConfig` runs once per config object in `web-app-shell.tsx`. It sets `startTabIndex` to the tab whose URL equals `startUrl` ignoring trailing slashes, or 0, and fills a missing `startUrl` from that tab.

## Gotchas

- The `startUrl` host decides which links stay in the app and which tabs are external ([link-routing.md](link-routing.md)). A `startUrl` that matches no tab is never loaded: the first tab opens, but routing still uses that host.
- `theme` has no defaults on purpose: no hardcoded fallback colors.
- `splash` is build-time: the shell ignores it and `AppConfig` doesn't type it. The setup command `packages/web2app-shell/scripts/setup.mjs` (`npm run setup` here) passes `logo` (path from the app root), `background` (hex) and `logoWidth` (dp at @1x, bootsplash default if missing) to `react-native-bootsplash generate`. Rerun it after changing them → [native-build.md](native-build.md).

## Colors and texts

- `COLORS` (`src/shared/config/colors.ts`): fixed palette, black, white and greys for icons and text.
- Light/dark: `useSchemeColors` (`src/shared/lib`) maps the system scheme to a black or white background and the opposite foreground. Used by the root `SafeAreaView` and the tab bar.
- The error screen doesn't follow the scheme: white background, `COLORS.text`.
- `TEXTS` (`src/shared/config/texts.ts`): every user-visible string of the shell, English only, no i18n.
