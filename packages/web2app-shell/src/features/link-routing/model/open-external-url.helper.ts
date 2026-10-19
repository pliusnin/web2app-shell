import { Alert, Linking } from 'react-native';

import { TEXTS } from '../../../shared/config';

/**
 * Открывает URL вне приложения (браузер, телефон, почта или другое
 * приложение) и показывает алерт, если ни одно установленное приложение не
 * может его открыть.
 */
export const openExternalUrlHelper = (url: string) => {
  // Симулятор iOS резолвит tel: в false вместо ошибки
  Linking.openURL(url)
    .catch(() => false)
    .then(opened => {
      if (!opened) {
        Alert.alert(TEXTS.cantOpenLinkTitle, TEXTS.cantOpenLinkMessage);
      }
    });
};
