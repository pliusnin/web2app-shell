import { useEffect } from 'react';

import { createNotificationChannelHelper } from './create-notification-channel.helper';
import { requestNotificationPermissionHelper } from './request-notification-permission.helper';
import { subscribeToNotificationTopicHelper } from './subscribe-to-notification-topic.helper';

export const useNotificationsSetup = () => {
  useEffect(() => {
    createNotificationChannelHelper()
      .then(requestNotificationPermissionHelper)
      .then(subscribeToNotificationTopicHelper)
      .catch(console.warn);
  }, []);
};
