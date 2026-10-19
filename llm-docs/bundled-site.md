# bundled-site

The site ships inside the app as `webapp.zip`. On launch the shell unpacks it, adds the [bridge](bridge.md) and serves it from a local server; every tab opens a page of it.

## Entry points

- `src/features/bundled-site/model/prepare-site.helper.ts`: `prepareSiteHelper`, called from `app` before the tabs mount ([architecture.md](architecture.md)).
- `add-bridge-to-site.helper.ts`: the bridge file and its `<script>` in `index.html`.
- `start-site-server.helper.ts`: the local server.
- `src/shared/config/site.ts`: `SITE_ORIGIN` (`http://127.0.0.1:3035`), the origin every module compares against.

## Flow

1. `WebAppManager.install()` (`web-in-mobile-tools`): when `Documents/www/app` has no `index.html`, unpacks `webapp.zip` from the Android assets or the iOS main bundle into it.
2. `addBridgeToSiteHelper`: writes `BRIDGE_SCRIPT` to `native-bridge.js` and loads it first in `<head>` of `index.html`, so it runs before the site's own scripts.
3. `startSiteServerHelper`: `@dr.pogodin/react-native-static-server` serves the directory on `SITE_ORIGIN`. A path without a file gets `index.html`, the site routes it itself.
4. The tabs mount once the site is ready and the cookies are restored ([cookie-persistence.md](cookie-persistence.md)).

## Gotchas

- The port is fixed: the origin, and with it the site's localStorage and cookies, stays the same between launches.
- `127.0.0.1`, not `localhost`: Android blocks DNS lookups, `localhost` included, while the app has no network access.
- iOS kills the socket of a backgrounded app, so the server stops in the background and starts again on foreground (`stopInBackground`).
- Without a state listener the library replaces a failed auto-start on foreground with a generic unhandled rejection (`auto-start on the app going into foreground failed`). `startSiteServerHelper` subscribes and logs `CRASHED` with its real details.
- After a JS reload in development the native server is still running; `getActiveServerId` attaches to it instead of starting a second one on the same port.
- `install()` does nothing while `index.html` exists: a new `webapp.zip` in an app update reaches users only after a reinstall. `WebAppManager.updateIfNewer(url)` updates from a URL but is not wired in.
- The bridge file is rewritten on every launch, so an app update brings its new bridge to an already unpacked site.
- A failed preparation still mounts the tabs: the WebView shows its error page and the splash hides ([web-page.md](web-page.md)).
- `web-in-mobile-tools` is vendored as `packages/web2app-shell/vendor/web-in-mobile-tools-0.1.0.tgz`. Its `WebServer` is not used: it has no `extraConfig` for the single-page-app fallback.
- Release Android builds allow plain HTTP only to `127.0.0.1` (`android/app/src/release`), debug builds allow it everywhere for Metro → [native-build.md](native-build.md).

## How to change

- Another site: replace `ios/web2appShell/webapp.zip` and `android/app/src/main/assets/webapp.zip` (the same file) and set the tab paths in `web-app-config.json` ([config.md](config.md)). The archive needs `index.html` at its root.
