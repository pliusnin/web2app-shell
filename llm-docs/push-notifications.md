# push-notifications

FCM delivers pushes. notify-kit (`react-native-notify-kit`, the maintained fork of Notifee with the same API, default export still named `notifee`) creates the Android channel, asks for permission and shows pushes while the app is open. Both hooks run once from `app`.

## Entry points

- `src/features/push-notifications/model/use-notifications-setup.ts`: on start, Android channel → permission → APNs registration → topic subscription.
- `src/features/push-notifications/model/use-foreground-notifications.ts`: `onMessage` → system notification via notify-kit.
- `src/features/push-notifications/config/notifications.ts`: `NOTIFICATIONS` with `topic: 'all'` and `channelId: 'default'`.

## Contracts

- Sender: `notification` messages (title, body, optional `data`) sent to topic `all`. No device tokens are collected.
- Data-only messages are never shown, on purpose.
- App open: FCM doesn't show the push, `displayRemoteMessageHelper` shows it with notify-kit (title, body, `data`, channel `default`).
- App in background or closed: the OS shows the `notification` message itself, no JS runs. `index.js` has no `setBackgroundMessageHandler` for that reason.
- `channelId` in `notifications.ts` must equal `messaging_android_notification_channel_id` in `firebase.json`. Android background pushes without an explicit channel use the one from `firebase.json`; if that channel doesn't exist, FCM falls back to its own default channel instead of the high-importance one.

## Gotchas

- The setup chain only logs errors with `console.warn`, so a push problem never breaks the app.
- Without permission (iOS, Android 13+) pushes arrive but are not shown.
- iOS: FCM needs the APNs token before it can create its own token, so `subscribeToTopic` called earlier fails with `No APNS token specified before fetching FCM Token`. `firebase.json` turns off `messaging_ios_auto_register_for_remote_messages`, and the chain awaits `registerDeviceForRemoteMessages` before subscribing. It resolves at once on Android and rejects after 10 s if APNs doesn't answer.
- iOS Simulator on Apple Silicon never gets an APNs token: RNFB skips the APNs registration there on purpose. Test FCM pushes on a physical iPhone; `xcrun simctl push` only checks how a notification is shown.
- A changed `firebase.json` needs a native rebuild: RNFB copies it into `Info.plist` at build time.
- Android: without `pressAction: { id: 'default' }` a tap on a notify-kit notification doesn't open the app.
- Tap handling is not implemented yet. When adding it, keep the sender contract above.
- RNFB is used through the modular API (`getMessaging()`, `onMessage(messaging, …)`, `subscribeToTopic(messaging, topic)`), not `messaging().…`.
- `@notifee/react-native` was archived by Invertase in April 2026, so the app uses `react-native-notify-kit` 10.x. It is New Architecture only and keeps Notifee's pod names (`RNNotifee`), so Notifee's docs still apply.

## Related

- Firebase config files, Podfile, APNs entitlement, Android permission → [native-build.md](native-build.md)
