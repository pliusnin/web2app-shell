import { readSecureItemHelper } from '../../../../shared/lib';
import { BIOMETRIC_LOGIN_SERVICE } from '../../config/biometric-login';
import type { BiometricLogin } from './biometric-login.types';

/**
 * Читает вошедшего пользователя и того, кто включил биометрический вход.
 */
export const readBiometricLoginHelper = async (): Promise<BiometricLogin> =>
  (await readSecureItemHelper<BiometricLogin>(BIOMETRIC_LOGIN_SERVICE)) ?? {
    user: null,
    biometricsUser: null,
  };
