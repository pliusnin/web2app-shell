import { Platform, Settings } from 'react-native';
import * as Keychain from 'react-native-keychain';

const INSTALL_MARKER_KEY = 'web2appShellInstalled';

/**
 * Deletes everything the app stores in the Keychain on the first launch after
 * install. The iOS Keychain survives app deletion while NSUserDefaults does
 * not, so a reinstalled app won't sign in with the previous install's
 * data.
 */
export const resetSecureStorageAfterInstallHelper = async () => {
  if (Platform.OS !== 'ios' || Settings.get(INSTALL_MARKER_KEY)) {
    return;
  }
  const services = await Keychain.getAllGenericPasswordServices();
  await Promise.all(
    services.map(service => Keychain.resetGenericPassword({ service })),
  );
  Settings.set({ [INSTALL_MARKER_KEY]: true });
};
