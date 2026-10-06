import Toast from 'react-native-toast-message';

import { TEXTS } from '../config';

export const showOfflineToast = () => {
  Toast.show({ type: 'info', text1: TEXTS.offlineTitle });
};
