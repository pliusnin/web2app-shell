import {
  getMessaging,
  registerDeviceForRemoteMessages,
} from '@react-native-firebase/messaging';

/**
 * Registers the device with APNs and waits for its token so FCM can create its
 * own token and the topic subscription does not fail on iOS. Resolves
 * immediately on Android.
 */
export const registerForRemoteMessagesHelper = () =>
  registerDeviceForRemoteMessages(getMessaging());
