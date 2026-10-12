import notifee from 'react-native-notify-kit';

/**
 * Asks the user for permission to show notifications (iOS, Android 13+).
 * Without it pushes arrive but are not shown.
 */
export const requestNotificationPermissionHelper = () =>
  notifee.requestPermission();
