import type { Notification } from 'react-native-notify-kit';
import type { RemoteMessage } from '@react-native-firebase/messaging';

import { NOTIFICATIONS } from '../config/notifications';

/**
 * Превращает сообщение FCM в уведомление notifee: заголовок, текст и данные
 * как есть, плюс канал пушей на Android.
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
    // Без pressAction Android не открывает приложение по тапу
    pressAction: { id: 'default' },
  },
});
