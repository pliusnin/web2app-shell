# Package

The shell is the local package `packages/web2app-shell`. Any React Native CLI app gets it by copying the folder and running one command. Native setup stays with the app. Consumer steps and the native checklist: `packages/web2app-shell/README.md`. It copies native code and config from this repo, so a change to `ios/`, `android/` or the config schema goes to the README in the same change.

## Layout

- `src/`: the shell code. `src/` paths in llm-docs are relative to the package.
- `package.json`: `main` and `types` point to `src/index.ts`. No build, the app's Metro, Babel and `tsc` compile the source.
- `scripts/setup.mjs`: the setup command, the only entry point. Runs `installDependencies`, then `generateSplash`.
- `scripts/install-dependencies.mjs`: `installDependencies`, see below.
- `scripts/generate-splash.mjs`: `generateSplash`, the native boot splash from `splash` in the app's `web-app-config.json` → [config.md](config.md). Without `splash` it logs a hint and returns, so a first setup before the config works.
- `scripts/run-command.mjs`: `runCommand`, shared by the scripts.
- `native/ios/SessionCookieStore.swift`: copied into new apps by hand, symlinked into this repo's iOS project → [cookie-persistence.md](cookie-persistence.md).
- `patches/`: `patch-package` patches for peer dependencies, applied by the app's `postinstall` with `--patch-dir packages/web2app-shell/patches`. Delete the folder when no patch is left: the setup command then skips patch-package.

## Dependencies

- Native modules plus `react` and `react-native` go to `peerDependencies`. React Native autolinking reads only the app's `package.json` (`findDependencies` in `@react-native-community/cli-config`), and the app needs a single copy of each.
- Pure JS libraries go to `dependencies` and come with the package.
- A new native dependency of `src/` goes to the package's `peerDependencies` and to the root `package.json` of this repo.

## Setup command

`node packages/web2app-shell/scripts/setup.mjs` from the app root (`npm run setup` here). Its install step runs one `npm install` with:

- `file:packages/web2app-shell`: npm links the folder into `node_modules` and installs its `dependencies`;
- every peer dependency missing from the app's `dependencies` and `devDependencies`, at the package's range.

Peers the app already has are not touched: npm checks them against `peerDependencies` and fails with `ERESOLVE` on a mismatch.

When `patches/` exists, before the install it adds `patch-package` to the app's `devDependencies` and appends `patch-package --patch-dir packages/web2app-shell/patches` to the app's `postinstall`, both only if missing, so a rerun changes nothing. After the install it runs `npx patch-package` once: `npm install <package>` doesn't run the app's `postinstall`.

## Gotchas

- No `node_modules` inside the package folder: Metro would resolve a second `react` from it.
- This repo is the first consumer: the root `package.json` has `"web2app-shell": "file:packages/web2app-shell"`, and the dev tooling (Jest, ESLint, Steiger, Prettier, `__mocks__`) stays at the root.
