import { AppState } from 'react-native';

import { promptBiometricsHelper } from './prompt-biometrics.helper';

// Shared by the WebViews of all tabs: each tab loads the site anew
let isVerified = false;

AppState.addEventListener('change', state => {
  if (state === 'background') {
    isVerified = false;
  }
});

/**
 * Verifies the user with the biometric prompt once before the app goes to the
 * background: a tab opened for the first time loads the site again and would
 * ask the user who has just passed the prompt once more.
 */
export const verifyUserHelper = async () => {
  if (!isVerified) {
    isVerified = await promptBiometricsHelper();
  }
  return isVerified;
};
