import CookieManager from '@preeternal/react-native-cookie-manager';

import { WEB_VIEW_COOKIE_STORE } from '../../../shared/config';
import { clearSecureItemHelper } from '../../../shared/lib';
import { COOKIE_STORAGE_SERVICE } from '../config/cookie-storage';

/**
 * Deletes the cookies of all WebViews and their saved copy, so the next page
 * opens signed out.
 */
export const clearWebViewCookiesHelper = async () => {
  await CookieManager.clearAll(WEB_VIEW_COOKIE_STORE);
  await clearSecureItemHelper(COOKIE_STORAGE_SERVICE);
};
