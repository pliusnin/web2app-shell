import * as Keychain from 'react-native-keychain';

/**
 * Удаляет значение, сохранённое под service хелпером writeSecureItemHelper.
 */
export const clearSecureItemHelper = async (service: string) => {
  await Keychain.resetGenericPassword({ service });
};
