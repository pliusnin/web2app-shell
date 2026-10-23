import * as Keychain from 'react-native-keychain';

/**
 * Reads the JSON value saved under service by writeSecureItemHelper, or
 * null if there is none.
 */
export const readSecureItemHelper = async <T>(
  service: string,
): Promise<T | null> => {
  const item = await Keychain.getGenericPassword({ service });
  return item ? JSON.parse(item.password) : null;
};
