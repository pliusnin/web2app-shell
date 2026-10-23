import {
  getMessaging,
  subscribeToTopic,
} from '@react-native-firebase/messaging';

import { NOTIFICATIONS } from '../config/notifications';

/**
 * Subscribes the device to a shared FCM topic so a push to the topic reaches
 * every installed app without collecting device tokens.
 */
export const subscribeToNotificationTopicHelper = () =>
  subscribeToTopic(getMessaging(), NOTIFICATIONS.topic);
