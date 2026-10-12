import { useEffect } from 'react';
import { getMessaging, onMessage } from '@react-native-firebase/messaging';

import { displayRemoteMessageHelper } from './display-remote-message.helper';

/**
 * Shows pushes that arrive while the app is open. In the background and
 * when the app is closed the system shows them itself.
 */
export const useForegroundNotifications = () => {
  useEffect(() => onMessage(getMessaging(), displayRemoteMessageHelper), []);
};
