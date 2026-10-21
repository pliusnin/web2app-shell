import { AppState } from 'react-native';

/**
 * Resolves once the app is in the foreground. System prompts shown before
 * that, such as the biometric one at launch, are cancelled by iOS.
 */
export const waitForActiveAppHelper = () =>
  new Promise<void>(resolve => {
    if (AppState.currentState === 'active') {
      resolve();
      return;
    }
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        subscription.remove();
        resolve();
      }
    });
  });
