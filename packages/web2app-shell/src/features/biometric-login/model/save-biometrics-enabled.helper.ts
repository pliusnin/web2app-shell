import { DeviceEventEmitter } from 'react-native';

import {
  clearSecureItemHelper,
  writeSecureItemHelper,
} from '../../../shared/lib';
import {
  BIOMETRIC_LOGIN_SERVICE,
  BIOMETRICS_CHANGED_EVENT,
} from '../config/biometric-login';
import type { BiometricLogin } from './biometric-login.types';

/**
 * Saves whether biometric login is on and notifies every page so that all
 * tabs get the new state.
 */
export const saveBiometricsEnabledHelper = async (isEnabled: boolean) => {
  if (isEnabled) {
    const stored: BiometricLogin = { isEnabled };
    await writeSecureItemHelper(BIOMETRIC_LOGIN_SERVICE, stored);
  } else {
    await clearSecureItemHelper(BIOMETRIC_LOGIN_SERVICE);
  }
  DeviceEventEmitter.emit(BIOMETRICS_CHANGED_EVENT);
};
