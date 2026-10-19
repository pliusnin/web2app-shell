# biometric-login

Sign-in with Face ID, Touch ID or a fingerprint. After every sign-in the site sends the login and password; when the user turned biometric login on, the sign-in screen asks the app to confirm the user, and the app gives the credentials back for the site to sign in with. Commands go through the [bridge](bridge.md).

## Entry points

- `src/pages/web-page/model/biometric-login/use-biometric-login.ts`: the commands of one page and its state updates.
- `get-biometrics-state.helper.ts`: the state the site gets.
- `confirm-biometric-login.helper.ts`: the credentials after the system prompt.
- `prompt-biometrics.helper.ts`: the system prompt itself.
- `read-sensor.helper.ts`: the sensor check for the state and `IS_BIOMETRICS_AVAILABLE`; a failed check counts as no biometrics.
- `verify-user.helper.ts`: the prompt for WebAuthn of the site ([bridge.md](bridge.md)), once until the app goes to the background.

## Flow

The Keychain keeps two users: `user`, signed in now, and `biometricsUser`, who turned biometric login on.

| Command                            | Effect                                                                                    |
| ---------------------------------- | ----------------------------------------------------------------------------------------- |
| `LOGGED_IN`                        | `user` saved; when it is `biometricsUser`, that one's password is updated too             |
| `LOGGED_OUT`                       | `user` forgotten, `biometricsUser` stays                                                  |
| `BIOMETRICS_ON` / `BIOMETRICS_OFF` | `biometricsUser` becomes `user` / `null`                                                  |
| `LOGIN_WITH_BIOMETRICS`            | the prompt; once confirmed `LOGIN` with `biometricsUser`'s email and password to the page |

State for the site: sensor available, Face ID or not, and enabled when `biometricsUser` exists and nobody is signed in or `user` is the same.

## Gotchas

- Logins are compared without case.
- Every change emits `BIOMETRICS_CHANGED_EVENT` on `DeviceEventEmitter`; every mounted page sends the new state to its WebView. A page also gets it on `WEB_READY`.
- A canceled prompt rejects with `USER_CANCEL` on iOS and `USER_CANCELED` on Android: both mean "no", not an error.
- Storage: Keychain, cleared on the first launch after an iOS reinstall.
- `NSFaceIDUsageDescription` in `Info.plist` and `USE_BIOMETRIC` in the manifest ([native-build.md](native-build.md)).
