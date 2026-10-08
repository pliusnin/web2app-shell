import notifee from 'react-native-notify-kit';
import type { RemoteMessage } from '@react-native-firebase/messaging';

import { mapRemoteMessageToNotificationHelper } from './map-remote-message-to-notification.helper';

/**
 * Shows a received push as a system notification. FCM doesn't show pushes
 * itself while the app is open. Data-only messages are skipped.
 */
export const displayRemoteMessageHelper = async (message: RemoteMessage) => {
  if (!message.notification) {
    return;
  }
  await notifee.displayNotification(
    mapRemoteMessageToNotificationHelper(message),
  );
};
