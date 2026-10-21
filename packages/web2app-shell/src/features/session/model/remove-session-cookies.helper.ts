import CookieManager from '@preeternal/react-native-cookie-manager';

import { SITE_ORIGIN, WEB_VIEW_COOKIE_STORE } from '../../../shared/config';

/**
 * Removes from the WebView cookie store the cookies the app set for the site
 * for the session.
 */
export const removeSessionCookiesHelper = async (
  cookieNames: Array<string>,
) => {
  await Promise.all(
    cookieNames.map(name =>
      CookieManager.clearByName(SITE_ORIGIN, name, WEB_VIEW_COOKIE_STORE),
    ),
  );
};
