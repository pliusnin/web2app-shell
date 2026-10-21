import notifee from 'react-native-notify-kit';

/**
 * Asks the user for notification permission (iOS, Android 13+). Without it
 * pushes arrive but are not shown.
 */
export const requestNotificationPermissionHelper = () =>
  notifee.requestPermission();
