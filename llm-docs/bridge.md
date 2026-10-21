# bridge

The site talks to the app through its own bridge file: the site's developers add it to the web app before the build and call its methods where needed. The app doesn't patch the site. It gives every page `window.__MG_Native`, which the bridge file reads, and handles the commands the file sends with `window.ReactNativeWebView.postMessage`. Messages are `{ cmd, args }`.

## Entry points

- `src/shared/bridge/bridge.types.ts`: every command and its args, the contract in one place.
- `src/shared/bridge/bridge-script.ts`: `BRIDGE_SCRIPT`, the WebView's `injectedJavaScriptBeforeContentLoaded` ([web-page.md](web-page.md)). It joins the parts in `script/` into one function, so the later parts use what the earlier define:
  - `core.script.ts`: `post`, `window.__MG_Native` with `isNative`, `state`, `onUpdate`, `onNativeEvent`, `__MG_Native_setState`, `__MG_Native_invoke`, `callApp` (a command that waits for the app's answer; an aborted signal rejects it and sends `ABORT_CALL`), `__MG_Native_reply`;
  - `fetch.script.ts`: `__MG_Native.fetch`, see below;
  - `biometrics.script.ts`: `__MG_Native.verifyUser()`, `__MG_Native.isBiometricsAvailable()`.
- `callPageScriptHelper({ fn, args })`: the script for `injectJavaScript` that calls `__MG_Native_invoke`, `__MG_Native_reply` or `__MG_Native_setState` on the page (`PageCall` in `bridge.types.ts`).
- `src/pages/web-page/model/bridge/use-bridge-messages.ts`: the page side, `onMessage`.

## Contract

Site → app, posted by the bridge file:

| Command                            | Args                             | Handled by                                           |
| ---------------------------------- | -------------------------------- | ---------------------------------------------------- |
| `WEB_READY`                        |                                  | splash, biometric state ([web-page.md](web-page.md)) |
| `DOWNLOAD_FILE`                    | `{ fileName, mimeType, base64 }` | `openDownloadedFileHelper`                           |
| `SAVE_TOKEN`                       | `{ token }`                      | [session.md](session.md)                             |
| `LOGGED_IN`                        | `{ user: { login, password } }`  | ignored, the app keeps no password                   |
| `LOGGED_OUT`                       |                                  | biometric login and session                          |
| `BIOMETRICS_ON` / `BIOMETRICS_OFF` |                                  | [biometric-login.md](biometric-login.md)             |

Site → app, sent by `window.__MG_Native` with a `callID`, the reply resolves the call:

| Call                      | Command                   | Resolves to                        |
| ------------------------- | ------------------------- | ---------------------------------- |
| `fetch(input, init)`      | `FETCH` / `ABORT_CALL`    | `Response`, `useNativeFetch`       |
| `verifyUser()`            | `VERIFY_USER`             | `true` / `false`, biometric prompt |
| `isBiometricsAvailable()` | `IS_BIOMETRICS_AVAILABLE` | `true` / `false`, sensor check     |

App → site:

| How                                                                             | What                                                 |
| ------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `invoke({ cmd: 'CHANGE_LOCATION', args: { url } })`                             | reselected tab ([tabs.md](tabs.md)), `onNativeEvent` |
| `setState({ isFingerprintAvailable, isFaceIdAvailable, isFingerprintEnabled })` | `__MG_Native.state`, `onUpdate` listeners            |

`onUpdate(cb)` and `onNativeEvent(cb)` return an unsubscribe function.

## fetch

A request through the app, whose requests need no CORS headers. The bridge file decides which requests go through it; the app doesn't intercept the page's own `fetch` or XHR.

1. The script builds a `Request`, so the browser encodes the body (forms with their boundary, files) and sets `Content-Type`. Bytes and headers go to the app in base64 as `callApp('FETCH', …)`.
2. `nativeFetchHelper` sends them with React Native's `fetch`, a body without a type as `application/octet-stream`, and replies with status, headers, final URL and the body in base64.
3. The script rebuilds a real `Response`. A failed request is a `TypeError`, an HTTP error is a response with its status.
4. An aborted signal sends `ABORT_CALL` with the call's `callID`, the app aborts the request.

## Gotchas

- Android: react-native-webview 14 runs `injectedJavaScriptBeforeContentLoaded` in `onPageStarted`, which can be after the site's own scripts. A bridge file that reads `window.__MG_Native` once on load can miss it; reading it on every call doesn't.
- A site that doesn't send `WEB_READY` keeps the splash on.
- `CHANGE_LOCATION` changes nothing by itself: the site's bridge file navigates in `onNativeEvent`.
- `useBridgeMessages` drops messages whose `nativeEvent.url` fails `isAppUrlHelper`: any frame can post, and iOS reports the URL of the frame that posted, Android (WebMessageListener) its origin, so a foreign iframe is cut off.
- `callID` starts with an ID of the page load: a reply for a page that reloaded meanwhile finds no call and is dropped.
- Cookies go with `fetch` only for `credentials: 'include'`. On Android React Native shares the WebView cookie store; on iOS it sends the cookies of its own `NSHTTPCookieStorage`, not the WebView's.
- Bodies and responses travel as base64 through `postMessage` and `injectJavaScript`: big files cost memory.
- A confirmed `verifyUser()` counts for every tab until the app goes to the background ([biometric-login.md](biometric-login.md)).
- The script parts are strings: `tsc`, ESLint and Prettier don't check them. Keep them in plain browser JS, no backticks and no `${`.
