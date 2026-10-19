import notifee from 'react-native-notify-kit';

/**
 * Запрашивает у пользователя разрешение на уведомления (iOS, Android 13+).
 * Без него пуши приходят, но не показываются.
 */
export const requestNotificationPermissionHelper = () =>
  notifee.requestPermission();
