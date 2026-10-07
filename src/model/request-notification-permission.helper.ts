import notifee from '@notifee/react-native';

export const requestNotificationPermissionHelper = () =>
  notifee.requestPermission();
