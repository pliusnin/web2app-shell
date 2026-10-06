import { Alert, Linking } from 'react-native';

export const openExternalUrl = async (url: string) => {
  // The iOS simulator resolves tel: to false instead of failing
  const opened = await Linking.openURL(url).catch(() => false);
  if (!opened) {
    Alert.alert("Can't open the link", 'No app is installed to open it.');
  }
};
