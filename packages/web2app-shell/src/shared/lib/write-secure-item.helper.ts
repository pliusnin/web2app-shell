import * as Keychain from 'react-native-keychain';

/**
 * Сохраняет значение как JSON в Keychain под service. Оно доступно после
 * первой разблокировки, поэтому сохранение работает при блокировке экрана,
 * и не попадает в бэкапы и перенос на другое устройство.
 */
export const writeSecureItemHelper = async (service: string, value: object) => {
  await Keychain.setGenericPassword(service, JSON.stringify(value), {
    service,
    accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
    // Android Keystore без биометрического промпта: сохранение идёт в фоне
    storage: Keychain.STORAGE_TYPE.AES_GCM_NO_AUTH,
  });
};
