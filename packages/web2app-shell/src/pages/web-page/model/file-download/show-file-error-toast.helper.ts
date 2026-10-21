import Toast from 'react-native-toast-message';

import { TEXTS } from '../../../../shared/config';

/** Shows the "Couldn't open the file" toast. */
export const showFileErrorToastHelper = () => {
  Toast.show({ type: 'error', text1: TEXTS.fileOpenError });
};
