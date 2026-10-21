import type { Notification } from 'react-native-notify-kit';
import type { RemoteMessage } from '@react-native-firebase/messaging';

import { NOTIFICATIONS } from '../config/notifications';

/**
 * Turns an FCM message into a notifee notification: title, body and data as
 * is, plus the push channel on Android.
 */
export const mapRemoteMessageToNotificationHelper = ({
  notification,
  data,
}: RemoteMessage): Notification => ({
  title: notification?.title,
  body: notification?.body,
  data,
  android: {
    channelId: NOTIFICATIONS.channelId,
    // Without pressAction Android does not open the app on tap
    pressAction: { id: 'default' },
  },
});
