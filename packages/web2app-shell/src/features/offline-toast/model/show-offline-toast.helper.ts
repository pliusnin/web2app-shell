import Toast from 'react-native-toast-message';

import { TEXTS } from '../../../shared/config';

/** Показывает тост «Нет подключения к интернету». */
export const showOfflineToastHelper = () => {
  Toast.show({ type: 'info', text1: TEXTS.offlineTitle });
};
