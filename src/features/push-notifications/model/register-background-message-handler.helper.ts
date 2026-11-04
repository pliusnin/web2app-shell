import {
  getMessaging,
  setBackgroundMessageHandler,
} from '@react-native-firebase/messaging';

// The OS shows `notification` messages itself and data-only messages are not
// shown on purpose, so there is nothing to do. The handler still has to exist:
// RNFB settles the iOS background fetch and the Android headless task with it
const handleBackgroundMessage = async () => {};

/**
 * Registers the FCM handler for messages that arrive while the app is in the
 * background or closed. Must run in the app's `index.js` before
 * `AppRegistry.registerComponent`, outside of React.
 */
export const registerBackgroundMessageHandlerHelper = () =>
  setBackgroundMessageHandler(getMessaging(), handleBackgroundMessage);
