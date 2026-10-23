import { Alert, Linking } from 'react-native';

import { TEXTS } from '../../../shared/config';

/**
 * Opens the URL outside the app (browser, phone, mail or another app) and
 * shows an alert if no installed app can open it.
 */
export const openExternalUrlHelper = (url: string) => {
  // The iOS simulator resolves tel: to false instead of an error
  Linking.openURL(url)
    .catch(() => false)
    .then(opened => {
      if (!opened) {
        Alert.alert(TEXTS.cantOpenLinkTitle, TEXTS.cantOpenLinkMessage);
      }
    });
};
