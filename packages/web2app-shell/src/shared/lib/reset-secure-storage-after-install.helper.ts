import { Platform, Settings } from 'react-native';
import * as Keychain from 'react-native-keychain';

const INSTALL_MARKER_KEY = 'web2appShellInstalled';

/**
 * Удаляет всё, что приложение хранит в Keychain, при первом запуске после
 * установки. Keychain на iOS переживает удаление приложения, а NSUserDefaults
 * нет, поэтому переустановленное приложение не войдёт с данными прошлой
 * установки.
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
