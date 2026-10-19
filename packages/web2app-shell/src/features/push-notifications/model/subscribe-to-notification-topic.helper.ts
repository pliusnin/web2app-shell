import {
  getMessaging,
  subscribeToTopic,
} from '@react-native-firebase/messaging';

import { NOTIFICATIONS } from '../config/notifications';

/**
 * Подписывает устройство на общий FCM-топик, чтобы пуш в топик доходил
 * до каждого установленного приложения без сбора токенов устройств.
 */
export const subscribeToNotificationTopicHelper = () =>
  subscribeToTopic(getMessaging(), NOTIFICATIONS.topic);
