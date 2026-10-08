import Toast from 'react-native-toast-message';

import { TEXTS } from '../../../../shared/config';

/**
 * Shows the "Something went wrong" toast when a server error stopped the
 * load.
 */
export const showServerErrorToastHelper = () => {
  Toast.show({
    type: 'error',
    text1: TEXTS.serverErrorTitle,
    text2: TEXTS.serverErrorMessage,
  });
};
