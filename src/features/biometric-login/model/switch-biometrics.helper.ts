import { promptBiometricsHelper } from './prompt-biometrics.helper';
import { saveBiometricsEnabledHelper } from './save-biometrics-enabled.helper';

/**
 * Turns biometric login on or off after the system biometric prompt. A
 * cancelled prompt changes nothing.
 */
export const switchBiometricsHelper = async (isEnabled: boolean) => {
  if (await promptBiometricsHelper()) {
    await saveBiometricsEnabledHelper(isEnabled);
  }
};
