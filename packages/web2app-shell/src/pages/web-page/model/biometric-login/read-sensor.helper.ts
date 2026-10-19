import { isSensorAvailable } from '@sbaiahmed1/react-native-biometrics';
import type { BiometricSensorInfo } from '@sbaiahmed1/react-native-biometrics';

/**
 * Читает, есть ли на устройстве биометрия для промпта и какая. Неудачная
 * проверка считается отсутствием биометрии.
 */
export const readSensorHelper = (): Promise<
  Pick<BiometricSensorInfo, 'available' | 'biometryType'>
> => isSensorAvailable().catch(() => ({ available: false }));
