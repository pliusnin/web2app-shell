import { saveBiometricsEnabledHelper } from '../../features/biometric-login';
import { clearWebViewCookiesHelper } from '../../features/cookie-persistence';
import { clearSessionHelper } from '../../features/session';

/**
 * Signs out from the lock screen, where the site is not open: deletes the
 * session and its cookies and turns biometric login off.
 */
export const signOutHelper = async () => {
  await clearSessionHelper();
  await clearWebViewCookiesHelper();
  await saveBiometricsEnabledHelper(false);
};
