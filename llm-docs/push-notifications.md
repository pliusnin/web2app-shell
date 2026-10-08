# push-notifications

FCM delivers pushes. Notifee creates the Android channel, asks for permission and shows pushes while the app is open. Both hooks run once from `app`.

## Entry points

- `src/features/push-notifications/model/use-notifications-setup.ts`: on start, Android channel → permission → topic subscription.
- `src/features/push-notifications/model/use-foreground-notifications.ts`: `onMessage` → system notification via Notifee.
- `src/features/push-notifications/config/notifications.ts`: `NOTIFICATIONS` with `topic: 'all'` and `channelId: 'default'`.

## Contracts

- Sender: `notification` messages (title, body, optional `data`) sent to topic `all`. No device tokens are collected.
- Data-only messages are never shown, on purpose.
- App open: FCM doesn't show the push, `displayRemoteMessageHelper` shows it with Notifee (title, body, `data`, channel `default`).
- App in background or closed: the OS shows the `notification` message itself, no JS runs. `index.js` has no `setBackgroundMessageHandler` for that reason.
- `channelId` in `notifications.ts` must equal `messaging_android_notification_channel_id` in `firebase.json`. Android background pushes without an explicit channel use the one from `firebase.json`; if that channel doesn't exist, FCM falls back to its own default channel instead of the high-importance one.

## Gotchas

- The setup chain only logs errors with `console.warn`, so a push problem never breaks the app.
- Without permission (iOS, Android 13+) pushes arrive but are not shown.
- Android: without `pressAction: { id: 'default' }` a tap on a Notifee notification doesn't open the app.
- Tap handling is not implemented yet. When adding it, keep the sender contract above.
- RNFB is used through the modular API (`getMessaging()`, `onMessage(messaging, …)`, `subscribeToTopic(messaging, topic)`), not `messaging().…`.
- `@notifee/react-native` 9.1.8 has had no release since Dec 2024. If it breaks, `react-native-notify-kit` is a fork with the same API: only the imports change.

## Related

- Firebase config files, Podfile, APNs entitlement, Android permission → [native-build.md](native-build.md)
