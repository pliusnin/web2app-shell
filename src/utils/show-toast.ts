import Toast from 'react-native-toast-message';

import { TEXTS } from '../constants';

export const showServerErrorToast = () => {
  Toast.show({
    type: 'error',
    text1: TEXTS.serverErrorToast,
    text2: TEXTS.serverErrorToastMessage,
  });
};

export const showOfflineToast = () => {
  Toast.show({ type: 'info', text1: TEXTS.offlineToast });
};
