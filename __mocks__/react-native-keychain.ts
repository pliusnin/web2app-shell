export const ACCESSIBLE = {
  AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY:
    'AccessibleAfterFirstUnlockThisDeviceOnly',
};
export const STORAGE_TYPE = { AES_GCM_NO_AUTH: 'KeystoreAESGCM_NoAuth' };

export const getGenericPassword = jest.fn(() => Promise.resolve(false));
export const setGenericPassword = jest.fn(() => Promise.resolve(false));
export const resetGenericPassword = jest.fn(() => Promise.resolve(true));
export const getAllGenericPasswordServices = jest.fn(() => Promise.resolve([]));
