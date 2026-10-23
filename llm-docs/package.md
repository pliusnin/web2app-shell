# Package

The shell is this package: the repo root is the package. Any React Native CLI app gets it by copying the folder and running one command. Native setup stays with the app. Consumer steps and the native checklist: [README.md](../README.md). The README is the single source of the native setup (there is no `ios/`/`android/` in this repo), so a change to the native setup or the config schema goes to the README in the same change.

## Layout

- `src/`: the shell code. `src/` paths in llm-docs are relative to the package.
- `package.json`: `main` and `types` point to `src/index.ts`. No build, the app's Metro, Babel and `tsc` compile the source.
- `scripts/setup.mjs`: the setup command, the only entry point. Runs `installDependencies`, then `generateSplash`.
- `scripts/install-dependencies.mjs`: `installDependencies`, see below.
- `scripts/generate-splash.mjs`: `generateSplash`, the native boot splash from `splash` in the app's `web-app-config.json` → [config.md](config.md). Without `splash` it logs a hint and returns, so a first setup before the config works.
- `scripts/run-command.mjs`: `runCommand`, shared by the scripts.
- `vendor/web-in-mobile-tools-0.1.0.tgz`: unpacks the bundled site ([bundled-site.md](bundled-site.md)); a `file:` dependency of the package.
- `patches/`: `patch-package` patches for peer dependencies, applied by the app's `postinstall` with `--patch-dir packages/web2app-shell/patches`. Delete the folder when no patch is left: the setup command then skips patch-package.

## Dependencies

- Native modules plus `react` and `react-native` go to `peerDependencies`. React Native autolinking reads only the app's `package.json` (`findDependencies` in `@react-native-community/cli-config`), and the app needs a single copy of each.
- Pure JS libraries go to `dependencies` and come with the package.
- A new native dependency of `src/` goes to `peerDependencies` (the consumer app provides it) and to `devDependencies` (so it is installed here to run the tests).

## Setup command

`node packages/web2app-shell/scripts/setup.mjs` from the app root (the path the consumer copied the folder to). Its install step runs one `npm install` with:

- `file:packages/web2app-shell`: npm links the folder into `node_modules` and installs its `dependencies`;
- every peer dependency missing from the app's `dependencies` and `devDependencies`, at the package's range.

Peers the app already has are not touched: npm checks them against `peerDependencies` and fails with `ERESOLVE` on a mismatch.

When `patches/` exists, before the install it adds `patch-package` to the app's `devDependencies` and appends `patch-package --patch-dir packages/web2app-shell/patches` to the app's `postinstall`, both only if missing, so a rerun changes nothing. After the install it runs `npx patch-package` once: `npm install <package>` doesn't run the app's `postinstall`.

## Gotchas

- In a consumer app, no `node_modules` inside the copied package folder: Metro would resolve a second `react` from it. This repo's own `node_modules`, installed at the root to run the tests, is a different thing.
- This repo is the package itself: `package.json` at the root is the package manifest, and the dev tooling (Jest, ESLint, Steiger, Prettier, `__mocks__`) sits at the root beside `src/` to run the tests and checks. Peer dependencies are duplicated into `devDependencies` so a fresh clone can install and test.
