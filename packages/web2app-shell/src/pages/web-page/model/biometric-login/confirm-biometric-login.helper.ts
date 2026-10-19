import { promptBiometricsHelper } from './prompt-biometrics.helper';
import { readBiometricLoginHelper } from './read-biometric-login.helper';

/**
 * Показывает системный биометрический промпт и после подтверждения
 * возвращает пользователя, включившего биометрический вход, или null,
 * если пользователь отменил.
 */
export const confirmBiometricLoginHelper = async () => {
  const { biometricsUser } = await readBiometricLoginHelper();
  if (!biometricsUser || !(await promptBiometricsHelper())) {
    return null;
  }
  return biometricsUser;
};
