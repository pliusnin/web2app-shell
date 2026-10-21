import * as Keychain from 'react-native-keychain';

/**
 * Saves the value as JSON in the Keychain under service. It is available
 * after the first unlock, so saving works while the screen is locked, and
 * it is excluded from backups and transfer to another device.
 */
export const writeSecureItemHelper = async (service: string, value: object) => {
  await Keychain.setGenericPassword(service, JSON.stringify(value), {
    service,
    accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
    // Android Keystore without a biometric prompt: saving happens in the
    // background
    storage: Keychain.STORAGE_TYPE.AES_GCM_NO_AUTH,
  });
};
