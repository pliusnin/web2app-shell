import CookieManager from '@preeternal/react-native-cookie-manager';

import { WEB_VIEW_COOKIE_STORE } from '../config';

/**
 * Checks whether the WebView cookie store has a non-empty cookie with the name
 * for the URL. Sees HttpOnly cookies too, which the page's own scripts can't.
 */
export const hasWebViewCookieHelper = async (url: string, name: string) => {
  const cookies = await CookieManager.getAsArray(url, WEB_VIEW_COOKIE_STORE);
  // Sites often sign out by overwriting the cookie with an empty value
  return cookies.some(cookie => cookie.name === name && cookie.value !== '');
};
