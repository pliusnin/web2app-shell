# bundled-site

The site ships inside the app as `webapp.zip`. On launch the shell unpacks it and serves it from a local server as is; every tab opens a page of it. The site includes the [bridge](bridge.md) file itself. With `updateUrl` set in the config ([config.md](config.md)) it also updates the site over the air from that URL.

## Entry points

- `src/features/bundled-site/model/prepare-site.helper.ts`: `prepareSiteHelper`, called from `app` before the tabs mount ([architecture.md](architecture.md)).
- `install-bundled-site.helper.ts`: unpacking `webapp.zip`, again when the app ships another archive.
- `start-site-server.helper.ts`: the local server.
- `web-app-manager.ts`: the single `WebAppManager` (`web-in-mobile-tools`) instance shared by install and update.
- `update-site.helper.ts`: `updateSiteHelper`, one over-the-air check (`updateIfNewer`).
- `use-site-update.ts`: `useSiteUpdate`, runs the check on launch and on every foreground; called from `app` ([architecture.md](architecture.md)).
- `src/shared/config/site.ts`: `SITE_ORIGIN` (`http://127.0.0.1:3035`), the origin every module compares against.

## Flow

1. `installBundledSiteHelper`: takes the md5 of `webapp.zip` in the Android assets or the iOS main bundle (`SITE_ZIP_PATH`) and compares it with `.webapp-zip-md5` in `Documents/www/app`. On a mismatch, a missing marker included, it deletes the directory. Then `WebAppManager.install()` (`web-in-mobile-tools`) unpacks the archive when the directory has no `index.html`, and the helper writes the current md5 to the marker.
2. `startSiteServerHelper`: `@dr.pogodin/react-native-static-server` serves the directory on `SITE_ORIGIN`. A path without a file gets `index.html`, the site routes it itself.
3. The tabs mount once the site is ready and the cookies are restored ([cookie-persistence.md](cookie-persistence.md)).
4. `useSiteUpdate(updateUrl)`: with `updateUrl` set, `updateSiteHelper` runs `webApp.updateIfNewer(updateUrl)` on launch and on every foreground. The manager sends a `HEAD`, reads `last-modified` as the published version, and when it is newer than the installed one downloads the archive, validates it in a staging directory and swaps it into `SITE_DIR` by rename. The running site is untouched: the new version is served on the next launch, no WebView reload. A missing `updateUrl` turns the feature off.

## Gotchas

- The port is fixed: the origin, and with it the site's localStorage and cookies, stays the same between launches.
- `127.0.0.1`, not `localhost`: Android blocks DNS lookups, `localhost` included, while the app has no network access.
- iOS kills the socket of a backgrounded app, so the server stops in the background and starts again on foreground (`stopInBackground`).
- Without a state listener the library replaces a failed auto-start on foreground with a generic unhandled rejection (`auto-start on the app going into foreground failed`). `startSiteServerHelper` subscribes and logs `CRASHED` with its real details.
- After a JS reload in development the native server is still running; `getActiveServerId` attaches to it instead of starting a second one on the same port.
- `install()` alone does nothing while `index.html` exists, so the md5 marker is what brings a new `webapp.zip` from an app update or a dev rebuild. The site's localStorage and cookies survive the reinstall: they belong to the origin, not the directory.
- Two update paths coexist: the md5 marker handles a new archive bundled in the app binary, `updateIfNewer` handles a newer archive published at `updateUrl`. A new bundled archive wins: the md5 mismatch deletes `SITE_DIR` and reinstalls, which drops the over-the-air version too; `installedVersion()` is then `null` and the next check re-downloads.
- The update is throttled by `SITE_UPDATE_MIN_INTERVAL_MS` (`config/bundled-site.ts`): checks made sooner resolve without touching the network, so the foreground trigger is cheap. The whole "is it newer, download, swap, record version" lives in the manager; the shell keeps no state of its own.
- The update swap is two renames, so the served directory is never half-written; a failed or corrupt download is a no-op and leaves the working site in place. Safe to run while the server serves because the running site is replaced only on the next launch.
- The marker lives inside the served directory, so it is removed together with the files it describes. The server also serves it at `/.webapp-zip-md5`; it holds only the archive hash.
- The md5 is computed over the whole archive on every launch (~150 KB now). The first launch after this check shipped finds no marker and unpacks once more.
- A failed preparation still mounts the tabs: the WebView shows its error page and the splash hides ([web-page.md](web-page.md)).
- `web-in-mobile-tools` is vendored as `vendor/web-in-mobile-tools-0.1.0.tgz`. Its `WebServer` is not used: it has no `extraConfig` for the single-page-app fallback.
- Release Android builds allow plain HTTP only to `127.0.0.1` (`android/app/src/release`), debug builds allow it everywhere for Metro → [native-build.md](native-build.md).

## How to change

- Another site: replace `ios/web2appShell/webapp.zip` and `android/app/src/main/assets/webapp.zip` (the same file) and set the tab paths in `web-app-config.json` ([config.md](config.md)). The archive needs `index.html` at its root.
- Over-the-air updates: set `updateUrl` in `web-app-config.json` to a URL that serves the same `webapp.zip` with a `last-modified` header. Publish a newer archive there and users get it on the next launch after their app next checks.
