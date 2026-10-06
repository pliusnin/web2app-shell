import { Alert, Linking } from 'react-native';

import { TEXTS } from '../constants';

export const openExternalUrl = async (url: string) => {
  // The iOS simulator resolves tel: to false instead of failing
  const opened = await Linking.openURL(url).catch(() => false);
  if (!opened) {
    Alert.alert(TEXTS.cantOpenLinkTitle, TEXTS.cantOpenLinkMessage);
  }
};
