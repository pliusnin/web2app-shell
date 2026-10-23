import { isSensorAvailable } from '@sbaiahmed1/react-native-biometrics';
import type { BiometricSensorInfo } from '@sbaiahmed1/react-native-biometrics';

/**
 * Reads whether the device has biometrics available for the prompt, and which
 * kind. A failed check counts as no biometrics.
 */
export const readSensorHelper = (): Promise<
  Pick<BiometricSensorInfo, 'available' | 'biometryType'>
> => isSensorAvailable().catch(() => ({ available: false }));
