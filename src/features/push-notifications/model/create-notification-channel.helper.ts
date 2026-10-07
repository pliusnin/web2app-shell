import notifee, { AndroidImportance } from '@notifee/react-native';

import { TEXTS } from '../../../shared/config';
import { NOTIFICATIONS } from '../config/notifications';

export const createNotificationChannelHelper = () =>
  notifee.createChannel({
    id: NOTIFICATIONS.channelId,
    name: TEXTS.notificationChannelName,
    importance: AndroidImportance.HIGH,
  });
