import * as Keychain from 'react-native-keychain';

/**
 * Читает JSON-значение, сохранённое под service хелпером
 * writeSecureItemHelper, или null, если его нет.
 */
export const readSecureItemHelper = async <T>(
  service: string,
): Promise<T | null> => {
  const item = await Keychain.getGenericPassword({ service });
  return item ? JSON.parse(item.password) : null;
};
