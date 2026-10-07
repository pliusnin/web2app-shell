import notifee from '@notifee/react-native';
import type { RemoteMessage } from '@react-native-firebase/messaging';

import { mapRemoteMessageToNotificationHelper } from './map-remote-message-to-notification.helper';

export const displayRemoteMessageHelper = async (message: RemoteMessage) => {
  if (!message.notification) {
    return;
  }
  await notifee.displayNotification(
    mapRemoteMessageToNotificationHelper(message),
  );
};
