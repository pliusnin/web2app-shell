import notifee from 'react-native-notify-kit';
import type { RemoteMessage } from '@react-native-firebase/messaging';

import { mapRemoteMessageToNotificationHelper } from './map-remote-message-to-notification.helper';

/**
 * Показывает полученный пуш системным уведомлением: при открытом приложении
 * FCM сам пуши не показывает. Data-only сообщения пропускаются.
 */
export const displayRemoteMessageHelper = async (message: RemoteMessage) => {
  if (!message.notification) {
    return;
  }
  await notifee.displayNotification(
    mapRemoteMessageToNotificationHelper(message),
  );
};
