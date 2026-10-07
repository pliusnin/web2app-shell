import Toast from 'react-native-toast-message';

import { TEXTS } from '../../../shared/config';

export const showOfflineToastHelper = () => {
  Toast.show({ type: 'info', text1: TEXTS.offlineTitle });
};
