import { useEffect } from 'react';
import { getMessaging, onMessage } from '@react-native-firebase/messaging';

import { displayRemoteMessageHelper } from './display-remote-message.helper';

export const useForegroundNotifications = () => {
  useEffect(() => onMessage(getMessaging(), displayRemoteMessageHelper), []);
};
