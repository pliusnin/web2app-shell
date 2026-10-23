# Config

The host app configures the shell with one JSON file. Types and resolution live in `src/shared/config`.

## Entry points

- `web-app-config.json`: the config of this app, imported by `App.tsx`.
- `src/shared/config/app-config.types.ts`: `AppConfig` (input) and `ResolvedConfig` (what the app reads).
- `src/shared/config/resolve-config.ts`: `resolveConfig`, `AppConfig` → `ResolvedConfig`.
- `useConfig()`: the resolved config in any component; throws outside `ConfigProvider`.

## Schema

The keys and their meaning are described once, in the package README: [Config](../README.md#config). Update the table there when the schema changes.

## Flow

`resolveConfig` runs once per config object in `web-app-shell.tsx`. It sets `startTabIndex` to the tab whose `url` equals `startUrl` ignoring trailing slashes, or 0.

## Gotchas

- The site itself is not in the config: it is `webapp.zip` in the native projects, served on `SITE_ORIGIN` (`src/shared/config/site.ts`) → [bundled-site.md](bundled-site.md).
- `theme` has no defaults on purpose: no hardcoded fallback colors.
- `splash` is build-time: the shell ignores it and `AppConfig` doesn't type it. The setup command `scripts/setup.mjs`, run from the app root, passes `logo` (path from the app root), `background` (hex) and `logoWidth` (dp at @1x, bootsplash default if missing) to `react-native-bootsplash generate`. Rerun it after changing them → [native-build.md](native-build.md).

## Colors and texts

- `COLORS` (`src/shared/config/colors.ts`): black and white for the light/dark scheme.
- Light/dark: `useSchemeColors` (`src/shared/lib`) maps the system scheme to a black or white background and the opposite foreground. Used by the root `SafeAreaView` and the tab bar.
- `TEXTS` (`src/shared/config/texts.ts`): every user-visible string of the shell, English only, no i18n.
