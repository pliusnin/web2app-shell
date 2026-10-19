import { AppState } from 'react-native';

import { promptBiometricsHelper } from './prompt-biometrics.helper';

// Общий для WebView всех табов: каждый таб загружает сайт заново
let isVerified = false;

AppState.addEventListener('change', state => {
  if (state === 'background') {
    isVerified = false;
  }
});

/**
 * Подтверждает пользователя биометрическим промптом один раз до ухода
 * приложения в фон: таб, открытый впервые, загружает сайт заново и снова
 * спросил бы пользователя, который только что прошёл промпт.
 */
export const verifyUserHelper = async () => {
  if (!isVerified) {
    isVerified = await promptBiometricsHelper();
  }
  return isVerified;
};
