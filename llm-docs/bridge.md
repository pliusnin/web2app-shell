# bridge

The site and the app talk through a script the WebView runs in every page before the page's own scripts. Messages are `{ cmd, args }`. The global names (`window.__MG_Native`, `__MG_Native_setState`, `__MG_Native_invoke`) keep a contract sites already use. `__MG_Native_reply` answers a call the script made with `callApp`, `FETCH` included.

## Entry points

- `src/shared/bridge/bridge.types.ts`: every command and its args, the contract in one place.
- `src/shared/bridge/bridge-script.ts`: `BRIDGE_SCRIPT` joins the parts in `script/` into one function, so the later parts use what the earlier define. The site's `index.html` loads it first, see [bundled-site.md](bundled-site.md):
  - `core.script.ts`: `post`, `readAsBase64`, `window.__MG_Native`, `setState`, `invoke`, `callApp` (a command that waits for the app's answer; an aborted signal rejects it and sends `ABORT_CALL`);
  - `fetch-proxy.script.ts`, `xhr-proxy.script.ts`: requests to other origins, see below;
  - `webauthn.script.ts`: WebAuthn of the site answered by the biometric prompt, see below;
  - `file-download.script.ts`: files the site makes in the browser, see [web-page.md](web-page.md);
  - `change-location.script.ts`: `CHANGE_LOCATION`;
  - `web-ready.script.ts`: `WEB_READY`.
- `callPageScriptHelper({ fn, args })`: the script for `injectJavaScript` that calls `__MG_Native_invoke`, `__MG_Native_reply` or `__MG_Native_setState` on the page (`PageCall` in `bridge.types.ts`).
- `src/pages/web-page/model/bridge/use-bridge-messages.ts`: the page side, `onMessage`.

## Contract

Site → app:

| Command                            | Args                                 | Handled by                                           |
| ---------------------------------- | ------------------------------------ | ---------------------------------------------------- |
| `WEB_READY`                        |                                      | splash, biometric state ([web-page.md](web-page.md)) |
| `FETCH` / `ABORT_CALL`             | request with `callID` / `{ callID }` | `useNativeFetch`, the reply is the response          |
| `DOWNLOAD_FILE`                    | `{ fileName, mimeType, base64 }`     | `openDownloadedFileHelper`                           |
| `SAVE_TOKEN`                       | `{ token }`                          | [session.md](session.md)                             |
| `LOGGED_IN`                        | `{ user: { login, password } }`      | [biometric-login.md](biometric-login.md)             |
| `LOGGED_OUT`                       |                                      | biometric login and session                          |
| `BIOMETRICS_ON` / `BIOMETRICS_OFF` |                                      | [biometric-login.md](biometric-login.md)             |
| `LOGIN_WITH_BIOMETRICS`            |                                      | [biometric-login.md](biometric-login.md)             |
| `VERIFY_USER`                      | `{ callID }`                         | biometric prompt, the reply is `true` / `false`      |
| `IS_BIOMETRICS_AVAILABLE`          | `{ callID }`                         | sensor check, the reply is `true` / `false`          |

App → site:

| How                                                                             | What                                                     |
| ------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `invoke({ cmd: 'LOGIN', args: { email, password } })`                           | after the biometric prompt, the site signs in            |
| `invoke({ cmd: 'CHANGE_LOCATION', args: { url } })`                             | handled by the script itself, the site gets a `popstate` |
| `setState({ isFingerprintAvailable, isFaceIdAvailable, isFingerprintEnabled })` | `__MG_Native.state`, `onUpdate` listeners                |

The site uses `__MG_Native.isNative`, `state`, `onUpdate(cb)`, `onNativeEvent(cb)` (app commands the script doesn't handle) and `fetch(input, init)` (a request through the app on purpose). Both `on*` return an unsubscribe function.

## Requests to other origins

`fetch` and `XMLHttpRequest` (axios too) to another origin go through the app, whose requests need no CORS headers. Same-origin and synchronous XHR stay in the browser.

1. The script builds a `Request`, so the browser encodes the body (forms with their boundary, files) and sets `Content-Type`. Bytes and headers go to the app in base64 as `callApp('FETCH', …)`.
2. `nativeFetchHelper` sends them with React Native's `fetch`, a body without a type as `application/octet-stream`, and replies with status, headers, final URL and the body in base64.
3. The script rebuilds a real `Response` (XHR: `response` by `responseType`, `json`, `text`, `blob`, `arraybuffer`, `document`). A failed request is a `TypeError` / XHR `error`, an HTTP error is a response with its status.
4. An aborted signal or an XHR `abort()` / `timeout` sends `ABORT_CALL` with the call's `callID`, the app aborts the request.
5. An XHR with a body gets `loadstart`, `progress`, `load`, `loadend` on `xhr.upload` once the body is handed to the app, all at 100%: the app reports no real upload progress, but `onUploadProgress` (axios) still fires.

## WebAuthn

For sites that use WebAuthn as a lock on their own UI: no server checks a signature, the site only reads the UV flag. The script replaces `navigator.credentials` and `PublicKeyCredential`:

- `PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()` → `IS_BIOMETRICS_AVAILABLE`;
- `navigator.credentials.create()` / `get()` → `VERIFY_USER`, the biometric prompt. Confirmed: a credential with `rawId` (random on `create`, the first `allowCredentials` id on `get`) and `authenticatorData` / `getAuthenticatorData()` with the UP and UV flags. Canceled or failed: `NotAllowedError`, as in a browser.
- A confirmed prompt counts for every tab until the app goes to the background, `VERIFY_USER` answers `true` without asking again. Every tab is a WebView of its own: a site that locks itself on launch would ask again in each tab opened for the first time. Confirmations inside the site, such as turning its lock off, pass without the prompt meanwhile.

The WebView's own WebAuthn can't work here: the origin `127.0.0.1` can't be a relying party, and iOS gives WebAuthn to an app's WebView only with Associated Domains.

## Gotchas

- Only the site's own `index.html` loads the script. `useBridgeMessages` drops messages whose `nativeEvent.url` fails `isAppUrlHelper`: any frame can post, and iOS reports the URL of the frame that posted, Android (WebMessageListener) its origin, so a foreign iframe is cut off.
- The WebAuthn credential has no key: `signature`, `clientDataJSON` and the attestation are missing. A site that verifies them on its server, or signs in without `allowCredentials` (discoverable credentials), doesn't work. `navigator.credentials` is fully replaced, other credential types (passwords, federated) are gone, WebViews don't support them anyway.
- The script is loaded by a `<script>` in `index.html`, not by `injectedJavaScriptBeforeContentLoaded`: on Android react-native-webview 14 runs that in `onPageStarted`, which can be after the site's own scripts.
- `callID` starts with an ID of the page load: a reply for a page that reloaded meanwhile finds no call and is dropped.
- Cookies go with a request only for `credentials: 'include'` / `withCredentials`. On Android React Native shares the WebView cookie store; on iOS it sends the cookies of its own `NSHTTPCookieStorage`, not the WebView's.
- Bodies and responses travel as base64 through `postMessage` and `injectJavaScript`: big files cost memory.
- `CHANGE_LOCATION` does `pushState` with the state react-router keeps (`idx`, `key`, `usr`) and dispatches `popstate`. It changes the screen only for a router that listens to `popstate`; on a site without one the URL changes and the page stays.
- `WEB_READY` fires two animation frames after `#root` gets children. A page without `#root` is ready once parsed.
- The script parts are strings: `tsc`, ESLint and Prettier don't check them. Keep them in plain browser JS, no backticks and no `${`.
