import { readSecureItemHelper } from '../../../shared/lib';
import { BIOMETRIC_LOGIN_SERVICE } from '../config/biometric-login';
import type { BiometricLogin } from './biometric-login.types';

/**
 * Reads whether the user turned biometric login on.
 */
export const isBiometricsEnabledHelper = async () =>
  !!(await readSecureItemHelper<BiometricLogin>(BIOMETRIC_LOGIN_SERVICE))
    ?.isEnabled;
