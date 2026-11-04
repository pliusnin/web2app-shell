import { getMessaging, getToken } from '@react-native-firebase/messaging';

/**
 * Logs the device's FCM token in dev builds. A push sent to the token, unlike
 * one sent to a topic, makes FCM report APNs delivery errors back to the
 * sender, so it is the way to test pushes on a device.
 */
export const logPushTokenHelper = async () => {
  if (!__DEV__) {
    return;
  }
  console.log('FCM token:', await getToken(getMessaging()));
};
