# biometric-login

Locks the app with Face ID, Touch ID or a fingerprint. The site's toggle turns it on or off after the system prompt. While it is on, a cold start shows the prompt before any page opens. The app keeps no password, only the on/off flag; the session stays in the site's cookies and the session token ([session.md](session.md)). Commands go through the [bridge](bridge.md).

## Entry points

- `src/features/biometric-login/model/switch-biometrics.helper.ts`: on/off after the prompt.
- `save-biometrics-enabled.helper.ts`, `is-biometrics-enabled.helper.ts`: the flag in the Keychain.
- `get-biometrics-state.helper.ts`: the state the site gets.
- `use-launch-lock.ts` and `ui/lock-screen.tsx`: the lock at a cold start, composed in `app` ([architecture.md](architecture.md)).
- `prompt-biometrics.helper.ts`: the system prompt itself.
- `read-sensor.helper.ts`: the sensor check for the state and `IS_BIOMETRICS_AVAILABLE`; a failed check counts as no biometrics.
- `verify-user.helper.ts`: the prompt for `verifyUser()` of the bridge, once until the app goes to the background.
- `src/pages/web-page/model/biometric-login/use-biometric-login.ts`: the commands of one page and its state updates.

## Flow

| Command                            | Effect                                                          |
| ---------------------------------- | --------------------------------------------------------------- |
| `BIOMETRICS_ON` / `BIOMETRICS_OFF` | the prompt; once confirmed the flag is saved, a cancel keeps it |
| `LOGGED_OUT`                       | the flag is cleared                                             |
| `LOGGED_IN`                        | ignored: the app keeps no password                              |

State for the site: sensor available, Face ID or not, and enabled when the flag is on.

Cold start with the flag on:

1. `useLaunchLock` waits for the app to be active and shows the prompt over the splash. The tabs don't mount meanwhile, so the site sends no requests, the token refresh included.
2. Confirmed → the tabs mount as usual.
3. Cancelled or failed → the splash hides and `LockScreen` shows "Unlock" (the prompt again) and "Sign out".
4. "Sign out" (`signOutHelper`, `app`): deletes the session token, all WebView cookies with their saved copy, and the flag; the tabs mount signed out.

## Gotchas

- Only a cold start locks. Returning from the background does not.
- The prompt waits for the `active` app state: iOS cancels a prompt shown before it.
- Every change emits `BIOMETRICS_CHANGED_EVENT` on `DeviceEventEmitter`; every mounted page sends the new state to its WebView. A page also gets it on `WEB_READY`. The site's checkbox follows the state, so it flips about a second after the tap, once the prompt is confirmed.
- A canceled prompt rejects with `USER_CANCEL` on iOS and `USER_CANCELED` on Android: both mean "no", not an error.
- A Keychain read that fails counts as off: the app opens unlocked.
- Storage: Keychain, cleared on the first launch after an iOS reinstall.
- `NSFaceIDUsageDescription` in `Info.plist` and `USE_BIOMETRIC` in the manifest ([native-build.md](native-build.md)).
