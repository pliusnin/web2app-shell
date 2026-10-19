import { useEffect } from 'react';
import { getMessaging, onMessage } from '@react-native-firebase/messaging';

import { createNotificationChannelHelper } from './create-notification-channel.helper';
import { displayRemoteMessageHelper } from './display-remote-message.helper';
import { registerForRemoteMessagesHelper } from './register-for-remote-messages.helper';
import { requestNotificationPermissionHelper } from './request-notification-permission.helper';
import { subscribeToNotificationTopicHelper } from './subscribe-to-notification-topic.helper';

/**
 * Настраивает пуши при старте: Android-канал, разрешение, регистрация в APNs,
 * подписка на топик. Ошибки только логируются, чтобы проблема с пушами не
 * ломала приложение. Пуши, пришедшие при открытом приложении, показывает
 * сам: в фоне и у закрытого приложения их показывает система.
 */
export const usePushNotifications = () => {
  useEffect(() => {
    createNotificationChannelHelper()
      .then(requestNotificationPermissionHelper)
      .then(registerForRemoteMessagesHelper)
      .then(subscribeToNotificationTopicHelper)
      .catch(console.warn);
  }, []);

  useEffect(() => onMessage(getMessaging(), displayRemoteMessageHelper), []);
};
