import notifee, { AndroidImportance } from '@notifee/react-native';

import { NOTIFICATIONS, TEXTS } from '../config';

export const createNotificationChannelHelper = () =>
  notifee.createChannel({
    id: NOTIFICATIONS.channelId,
    name: TEXTS.notificationChannelName,
    importance: AndroidImportance.HIGH,
  });
