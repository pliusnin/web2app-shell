import Toast from 'react-native-toast-message';

import { TEXTS } from '../config';

export const showServerErrorToastHelper = () => {
  Toast.show({
    type: 'error',
    text1: TEXTS.serverErrorTitle,
    text2: TEXTS.serverErrorMessage,
  });
};
