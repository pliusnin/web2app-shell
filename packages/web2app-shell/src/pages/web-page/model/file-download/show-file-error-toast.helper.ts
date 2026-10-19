import Toast from 'react-native-toast-message';

import { TEXTS } from '../../../../shared/config';

/** Показывает тост "Couldn't open the file". */
export const showFileErrorToastHelper = () => {
  Toast.show({ type: 'error', text1: TEXTS.fileOpenError });
};
