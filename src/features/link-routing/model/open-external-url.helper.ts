import { Alert, Linking } from 'react-native';

import { TEXTS } from '../../../shared/config';

export const openExternalUrlHelper = (url: string) => {
  // The iOS simulator resolves tel: to false instead of failing
  Linking.openURL(url)
    .catch(() => false)
    .then(opened => {
      if (!opened) {
        Alert.alert(TEXTS.cantOpenLinkTitle, TEXTS.cantOpenLinkMessage);
      }
    });
};
