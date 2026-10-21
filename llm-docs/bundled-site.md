# bundled-site

The site ships inside the app as `webapp.zip`. On launch the shell unpacks it and serves it from a local server as is; every tab opens a page of it. The site includes the [bridge](bridge.md) file itself.

## Entry points

- `src/features/bundled-site/model/prepare-site.helper.ts`: `prepareSiteHelper`, called from `app` before the tabs mount ([architecture.md](architecture.md)).
- `install-bundled-site.helper.ts`: unpacking `webapp.zip`, again when the app ships another archive.
- `start-site-server.helper.ts`: the local server.
- `src/shared/config/site.ts`: `SITE_ORIGIN` (`http://127.0.0.1:3035`), the origin every module compares against.

## Flow

1. `installBundledSiteHelper`: takes the md5 of `webapp.zip` in the Android assets or the iOS main bundle (`SITE_ZIP_PATH`) and compares it with `.webapp-zip-md5` in `Documents/www/app`. On a mismatch, a missing marker included, it deletes the directory. Then `WebAppManager.install()` (`web-in-mobile-tools`) unpacks the archive when the directory has no `index.html`, and the helper writes the current md5 to the marker.
2. `startSiteServerHelper`: `@dr.pogodin/react-native-static-server` serves the directory on `SITE_ORIGIN`. A path without a file gets `index.html`, the site routes it itself.
3. The tabs mount once the site is ready and the cookies are restored ([cookie-persistence.md](cookie-persistence.md)).

## Gotchas

- The port is fixed: the origin, and with it the site's localStorage and cookies, stays the same between launches.
- `127.0.0.1`, not `localhost`: Android blocks DNS lookups, `localhost` included, while the app has no network access.
- iOS kills the socket of a backgrounded app, so the server stops in the background and starts again on foreground (`stopInBackground`).
- Without a state listener the library replaces a failed auto-start on foreground with a generic unhandled rejection (`auto-start on the app going into foreground failed`). `startSiteServerHelper` subscribes and logs `CRASHED` with its real details.
- After a JS reload in development the native server is still running; `getActiveServerId` attaches to it instead of starting a second one on the same port.
- `install()` alone does nothing while `index.html` exists, so the md5 marker is what brings a new `webapp.zip` from an app update or a dev rebuild. The site's localStorage and cookies survive the reinstall: they belong to the origin, not the directory. `WebAppManager.updateIfNewer(url)` updates from a URL but is not wired in.
- The marker lives inside the served directory, so it is removed together with the files it describes. The server also serves it at `/.webapp-zip-md5`; it holds only the archive hash.
- The md5 is computed over the whole archive on every launch (~150 KB now). The first launch after this check shipped finds no marker and unpacks once more.
- A failed preparation still mounts the tabs: the WebView shows its error page and the splash hides ([web-page.md](web-page.md)).
- `web-in-mobile-tools` is vendored as `packages/web2app-shell/vendor/web-in-mobile-tools-0.1.0.tgz`. Its `WebServer` is not used: it has no `extraConfig` for the single-page-app fallback.
- Release Android builds allow plain HTTP only to `127.0.0.1` (`android/app/src/release`), debug builds allow it everywhere for Metro → [native-build.md](native-build.md).

## How to change

- Another site: replace `ios/web2appShell/webapp.zip` and `android/app/src/main/assets/webapp.zip` (the same file) and set the tab paths in `web-app-config.json` ([config.md](config.md)). The archive needs `index.html` at its root.
