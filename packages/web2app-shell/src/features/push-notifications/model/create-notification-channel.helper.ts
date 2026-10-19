import notifee, { AndroidImportance } from 'react-native-notify-kit';

import { TEXTS } from '../../../shared/config';
import { NOTIFICATIONS } from '../config/notifications';

/**
 * Создаёт Android-канал уведомлений для пушей. Android 8+ без канала
 * уведомления не показывает, высокая важность делает их всплывающими.
 * На iOS ничего не делает.
 */
export const createNotificationChannelHelper = () =>
  notifee.createChannel({
    id: NOTIFICATIONS.channelId,
    name: TEXTS.notificationChannelName,
    importance: AndroidImportance.HIGH,
  });
