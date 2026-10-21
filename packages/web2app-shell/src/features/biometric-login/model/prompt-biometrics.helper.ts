import { simplePrompt } from '@sbaiahmed1/react-native-biometrics';

import { TEXTS } from '../../../shared/config';

// A cancelled prompt is rejected with USER_CANCEL on iOS and USER_CANCELED
// on Android
const CANCEL_CODES = ['USER_CANCEL', 'USER_CANCELED'];

/**
 * Shows the system biometric prompt. Returns true when the user is
 * verified and false if they cancelled.
 */
export const promptBiometricsHelper = () =>
  simplePrompt(TEXTS.biometricPrompt).then(
    ({ success }) => success,
    error => {
      if (CANCEL_CODES.includes(error?.code)) {
        return false;
      }
      throw error;
    },
  );
