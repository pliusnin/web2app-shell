import {
  getMessaging,
  subscribeToTopic,
} from '@react-native-firebase/messaging';

import { NOTIFICATIONS } from '../config/notifications';

/**
 * Subscribes the device to the common FCM topic, so a push sent to the
 * topic reaches every installed app without collecting device tokens.
 */
export const subscribeToNotificationTopicHelper = () =>
  subscribeToTopic(getMessaging(), NOTIFICATIONS.topic);
