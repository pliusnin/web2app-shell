import { simplePrompt } from '@sbaiahmed1/react-native-biometrics';

import { TEXTS } from '../../../../shared/config';

// Отменённый промпт отклоняется с USER_CANCEL на iOS и USER_CANCELED
// на Android
const CANCEL_CODES = ['USER_CANCEL', 'USER_CANCELED'];

/**
 * Показывает системный биометрический промпт. Возвращает true, когда
 * пользователь подтверждён, и false, если он отменил.
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
