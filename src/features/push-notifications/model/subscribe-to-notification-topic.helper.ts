import {
  getMessaging,
  subscribeToTopic,
} from '@react-native-firebase/messaging';

import { NOTIFICATIONS } from '../config/notifications';

export const subscribeToNotificationTopicHelper = () =>
  subscribeToTopic(getMessaging(), NOTIFICATIONS.topic);
