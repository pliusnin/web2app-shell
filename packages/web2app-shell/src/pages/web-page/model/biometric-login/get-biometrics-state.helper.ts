import type { BiometricsState } from '../../../../shared/bridge';
import { isSameUserHelper } from './is-same-user.helper';
import { readBiometricLoginHelper } from './read-biometric-login.helper';
import { readSensorHelper } from './read-sensor.helper';

/**
 * Возвращает то, что сайт знает о биометрическом входе. Он включён для
 * пользователя, который его включил, а на экране входа — если его включил кто-либо.
 */
export const getBiometricsStateHelper = async (): Promise<BiometricsState> => {
  const [sensor, { user, biometricsUser }] = await Promise.all([
    readSensorHelper(),
    readBiometricLoginHelper(),
  ]);

  return {
    isFingerprintAvailable: sensor.available,
    isFaceIdAvailable: sensor.biometryType === 'FaceID',
    isFingerprintEnabled:
      !!biometricsUser && (!user || isSameUserHelper(user, biometricsUser)),
  };
};
