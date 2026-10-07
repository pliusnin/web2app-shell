import Toast from 'react-native-toast-message';

import { TEXTS } from '../../../../shared/config';

export const showServerErrorToastHelper = () => {
  Toast.show({
    type: 'error',
    text1: TEXTS.serverErrorTitle,
    text2: TEXTS.serverErrorMessage,
  });
};
