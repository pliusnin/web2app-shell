import { useEffect } from 'react';
import { getMessaging, onMessage } from '@react-native-firebase/messaging';

import { createNotificationChannelHelper } from './create-notification-channel.helper';
import { displayRemoteMessageHelper } from './display-remote-message.helper';
import { logPushTokenHelper } from './log-push-token.helper';
import { requestNotificationPermissionHelper } from './request-notification-permission.helper';
import { subscribeToNotificationTopicHelper } from './subscribe-to-notification-topic.helper';
import { waitForApnsTokenHelper } from './wait-for-apns-token.helper';

/**
 * Sets up pushes on start: Android channel, permission, APNs token, topic
 * subscription, the FCM token in the dev log. Errors are only logged so a push problem does not break
 * the app. Pushes that arrive while the app is open are shown by the app
 * itself; in the background or when the app is closed the system shows them.
 */
export const usePushNotifications = () => {
  useEffect(() => {
    createNotificationChannelHelper()
      .then(requestNotificationPermissionHelper)
      .then(waitForApnsTokenHelper)
      .then(subscribeToNotificationTopicHelper)
      .then(logPushTokenHelper)
      .catch(console.warn);
  }, []);

  useEffect(() => onMessage(getMessaging(), displayRemoteMessageHelper), []);
};
