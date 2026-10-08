import notifee, { AndroidImportance } from '@notifee/react-native';

import { TEXTS } from '../../../shared/config';
import { NOTIFICATIONS } from '../config/notifications';

/**
 * Creates the Android notification channel for pushes. Android 8+ shows no
 * notifications without a channel, high importance makes them pop up.
 * Does nothing on iOS.
 */
export const createNotificationChannelHelper = () =>
  notifee.createChannel({
    id: NOTIFICATIONS.channelId,
    name: TEXTS.notificationChannelName,
    importance: AndroidImportance.HIGH,
  });
