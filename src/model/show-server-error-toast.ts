import Toast from 'react-native-toast-message';

import { TEXTS } from '../config';

export const showServerErrorToast = () => {
  Toast.show({
    type: 'error',
    text1: TEXTS.serverErrorTitle,
    text2: TEXTS.serverErrorMessage,
  });
};
