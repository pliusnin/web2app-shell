import { DeviceEventEmitter } from 'react-native';

import { writeSecureItemHelper } from '../../../../shared/lib';
import {
  BIOMETRIC_LOGIN_SERVICE,
  BIOMETRICS_CHANGED_EVENT,
} from '../../config/biometric-login';
import type { BiometricLogin } from './biometric-login.types';
import { readBiometricLoginHelper } from './read-biometric-login.helper';

/**
 * Сохраняет изменение пользователей биометрического входа и сообщает о нём
 * каждой странице, чтобы все табы получили новое состояние.
 */
export const updateBiometricLoginHelper = async (
  change: (stored: BiometricLogin) => BiometricLogin,
) => {
  const stored = await readBiometricLoginHelper();
  await writeSecureItemHelper(BIOMETRIC_LOGIN_SERVICE, change(stored));
  DeviceEventEmitter.emit(BIOMETRICS_CHANGED_EVENT);
};
