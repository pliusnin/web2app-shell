import CookieManager from '@preeternal/react-native-cookie-manager';

import { SITE_ORIGIN, WEB_VIEW_COOKIE_STORE } from '../../../shared/config';

/**
 * Удаляет из cookie-хранилища WebView куки, которые приложение поставило
 * сайту для сессии.
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
