# push-notifications

FCM delivers pushes. notify-kit (`react-native-notify-kit`, the maintained fork of Notifee with the same API, default export still named `notifee`) creates the Android channel, asks for permission and shows pushes while the app is open. `usePushNotifications` runs once from `app`.

## Entry points

- `src/features/push-notifications/model/use-push-notifications.ts`: on start, Android channel → permission → APNs token → topic subscription → `FCM token:` in the dev log; while the app is open, `onMessage` → system notification via notify-kit.
- `src/features/push-notifications/model/register-background-message-handler.helper.ts`: `setBackgroundMessageHandler` with a no-op handler, exported from the package as `registerBackgroundMessageHandler`. The app calls it in `index.js` before `AppRegistry.registerComponent`: RNFB needs it outside React, before the app starts.
- `src/features/push-notifications/config/notifications.ts`: `NOTIFICATIONS` with `topic: 'all'` and `channelId: 'default'`.

## Contracts

- Sender: `notification` messages (title, body, optional `data`) sent to topic `all`. No device tokens are collected.
- Data-only messages are never shown, on purpose.
- App open: FCM doesn't show the push, `displayRemoteMessageHelper` shows it with notify-kit (title, body, `data`, channel `default`).
- App in background or closed: the OS shows the `notification` message itself. The background handler does nothing with it, it only lets RNFB finish its background work: the Android headless task and the iOS background fetch of `content-available` pushes. Without a handler RNFB warns `No background message handler has been set`. It does not affect whether a push is shown.
- `channelId` in `notifications.ts` must equal `messaging_android_notification_channel_id` in `firebase.json`. Android background pushes without an explicit channel use the one from `firebase.json`; if that channel doesn't exist, FCM falls back to its own default channel instead of the high-importance one.

## Gotchas

- To test on a device, send to the `FCM token:` from the Metro log, not to the topic. FCM fans a topic push out after it has answered the sender, so an APNs failure (wrong key, Team ID or bundle id) is silent there; a push to a token returns it, e.g. `THIRD_PARTY_AUTH_ERROR`. Only dev builds log the token.
- The setup chain only logs errors with `console.warn`, so a push problem never breaks the app.
- Without permission (iOS, Android 13+) pushes arrive but are not shown.
- iOS: FCM needs the APNs token before it can create its own token, so `subscribeToTopic` called earlier fails with `No APNS token specified before fetching FCM Token`. RNFB registers with APNs on every launch (`messaging_ios_auto_register_for_remote_messages`, on by default), and `waitForApnsTokenHelper` polls `getAPNSToken` every 500 ms before subscribing. It resolves at once on Android and rejects after 10 s without a token.
- Don't turn `messaging_ios_auto_register_for_remote_messages` off in favour of `registerDeviceForRemoteMessages`: once iOS reports the app as registered (every launch after the first), RNFB resolves it at once without asking APNs again, so FCM never gets the token on that launch.
- An APNs token needs no notification permission, only the `aps-environment` entitlement (the Push Notifications capability). The APNs auth key must be uploaded in the Firebase console, otherwise FCM accepts the push but APNs never delivers it.
- iOS Simulator on Apple Silicon never gets an APNs token: RNFB skips the APNs registration there on purpose. Test FCM pushes on a physical iPhone; `xcrun simctl push` only checks how a notification is shown.
- A changed `firebase.json` needs a native rebuild: RNFB copies it into `Info.plist` at build time.
- Android: without `pressAction: { id: 'default' }` a tap on a notify-kit notification doesn't open the app.
- Tap handling is not implemented yet. When adding it, keep the sender contract above.
- RNFB is used through the modular API (`getMessaging()`, `onMessage(messaging, …)`, `subscribeToTopic(messaging, topic)`), not `messaging().…`.
- `@notifee/react-native` was archived by Invertase in April 2026, so the app uses `react-native-notify-kit` 10.x. It is New Architecture only and keeps Notifee's pod names (`RNNotifee`), so Notifee's docs still apply.

## Related

- Firebase project, APNs key, service account, test push, error codes, for people → [docs/push-notifications-setup.md](../docs/push-notifications-setup.md)
- Firebase config files, Podfile, APNs entitlement, Android permission → [native-build.md](native-build.md)
