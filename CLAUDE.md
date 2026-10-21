# web2appShell

Read the doc of the area you change before editing it. If you change its behavior, contracts or file layout, update that doc in the same change; a new slice gets its own doc and a line here.

- Code rules: FSD imports, naming, SRP, comments, checks → @llm-docs/conventions.md
- Layer map, composition, public API, shared modules → [architecture.md](llm-docs/architecture.md)
- The `web2app-shell` package: layout, dependencies, setup command → [package.md](llm-docs/package.md)
- web-app-config.json schema, tab paths, theme and light/dark colors, texts → [config.md](llm-docs/config.md)
- The site in webapp.zip: unpacking, local server, bridge in index.html → [bundled-site.md](llm-docs/bundled-site.md)
- The tab page: WebView, bridge commands, failed loads, process recovery, splash hide → [web-page.md](llm-docs/web-page.md)
- Bottom tabs, icons, external tabs, reselect to root, Android back → [tabs.md](llm-docs/tabs.md)
- Which links open in the app and which outside → [link-routing.md](llm-docs/link-routing.md)
- FCM + notify-kit, topic, channel, payload contract → [push-notifications.md](llm-docs/push-notifications.md)
- Toast when the connection drops → [offline-toast.md](llm-docs/offline-toast.md)
- Staying signed in after the app is killed, WebView cookies in the Keychain → [cookie-persistence.md](llm-docs/cookie-persistence.md)
- Site ↔ app bridge: `window.__MG_Native` for the site's bridge file, commands, nativeFetch → [bridge.md](llm-docs/bridge.md)
- Session token check before the first page, `checkSession` → [session.md](llm-docs/session.md)
- Face ID / Touch ID / fingerprint: on/off, lock at a cold start → [biometric-login.md](llm-docs/biometric-login.md)
- iOS/Android build, pods, patches, splash assets → [native-build.md](llm-docs/native-build.md)
