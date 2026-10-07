import type { Notification } from '@notifee/react-native';
import type { RemoteMessage } from '@react-native-firebase/messaging';

import { NOTIFICATIONS } from '../config/notifications';

export const mapRemoteMessageToNotificationHelper = ({
  notification,
  data,
}: RemoteMessage): Notification => ({
  title: notification?.title,
  body: notification?.body,
  data,
  android: {
    channelId: NOTIFICATIONS.channelId,
    // Without a pressAction Android doesn't open the app on tap
    pressAction: { id: 'default' },
  },
});
