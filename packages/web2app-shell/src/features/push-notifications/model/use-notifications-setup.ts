import { useEffect } from 'react';

import { createNotificationChannelHelper } from './create-notification-channel.helper';
import { registerForRemoteMessagesHelper } from './register-for-remote-messages.helper';
import { requestNotificationPermissionHelper } from './request-notification-permission.helper';
import { subscribeToNotificationTopicHelper } from './subscribe-to-notification-topic.helper';

/**
 * Prepares push notifications on app start: creates the Android channel,
 * asks for permission, registers in APNs, then subscribes to the topic.
 * Errors are only logged, so a push problem doesn't break the app.
 */
export const useNotificationsSetup = () => {
  useEffect(() => {
    createNotificationChannelHelper()
      .then(requestNotificationPermissionHelper)
      .then(registerForRemoteMessagesHelper)
      .then(subscribeToNotificationTopicHelper)
      .catch(console.warn);
  }, []);
};
