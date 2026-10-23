import * as Keychain from 'react-native-keychain';

/**
 * Deletes the value saved under service by writeSecureItemHelper.
 */
export const clearSecureItemHelper = async (service: string) => {
  await Keychain.resetGenericPassword({ service });
};
