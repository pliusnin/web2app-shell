import {
  getMessaging,
  registerDeviceForRemoteMessages,
} from '@react-native-firebase/messaging';

/**
 * Registers the device in APNs and waits for its token, so FCM can create
 * its own token and the topic subscription doesn't fail on iOS.
 * Resolves at once on Android.
 */
export const registerForRemoteMessagesHelper = () =>
  registerDeviceForRemoteMessages(getMessaging());
