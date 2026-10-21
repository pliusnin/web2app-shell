import type { BiometricsState } from '../../../shared/bridge';
import { isBiometricsEnabledHelper } from './is-biometrics-enabled.helper';
import { readSensorHelper } from './read-sensor.helper';

/**
 * Returns what the site knows about biometric login: the sensor and whether
 * the user turned it on.
 */
export const getBiometricsStateHelper = async (): Promise<BiometricsState> => {
  const [sensor, isEnabled] = await Promise.all([
    readSensorHelper(),
    isBiometricsEnabledHelper(),
  ]);

  return {
    isFingerprintAvailable: sensor.available,
    isFaceIdAvailable: sensor.biometryType === 'FaceID',
    isFingerprintEnabled: isEnabled,
  };
};
