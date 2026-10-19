# session

Opens the site already signed in: after sign-in the site gives the app a long-lived token, and on the next launch the app checks it before the first page loads and sets the cookies of the check's response for the site.

## Entry points

- `src/features/session/model/session.types.ts`: `CheckSession`, exported from the package.
- `applySessionHelper(checkSession)`: the check on launch, called from `app` ([architecture.md](architecture.md)).
- `saveSessionTokenHelper(token)`: `SAVE_TOKEN` of the [bridge](bridge.md).
- `clearSessionHelper()`: `LOGGED_OUT` of the bridge.

## Contracts

`<WebAppShell config={...} checkSession={...} />`. `checkSession(token)` resolves to the `Response` of the check when the token is valid, to `null` when it is not, and throws when the check failed (no network). Without it there is no check: sites without sign-in need none.

## Flow

1. Launch, after the cookie restore ([cookie-persistence.md](cookie-persistence.md)): read the token, remove the cookies the app set last time, call `checkSession`.
2. Valid: `toSiteCookiesHelper` parses `Set-Cookie` and the cookies are set for `SITE_ORIGIN` with their lifetime and attributes. Their names are saved to remove them later.
3. `null`: the token is deleted. Throws: the token stays, the next launch checks again.
4. `LOGGED_OUT`: the token and the set cookies are removed.

## Gotchas

- The cookies come from the API's response but are set for the site's domain: their `Domain` is dropped.
- React Native's `fetch` has no `getSetCookie()`; `set-cookie-parser` splits the joined header.
- Errors never block the launch: the tabs show after the step or after 5 s.
- Storage: Keychain, cleared on the first launch after an iOS reinstall (`shared/lib`, [architecture.md](architecture.md)).
