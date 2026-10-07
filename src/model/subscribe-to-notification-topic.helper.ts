import {
  getMessaging,
  subscribeToTopic,
} from '@react-native-firebase/messaging';

import { NOTIFICATIONS } from '../config';

export const subscribeToNotificationTopicHelper = () =>
  subscribeToTopic(getMessaging(), NOTIFICATIONS.topic);
