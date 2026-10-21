import { Platform } from 'react-native';
import CookieManager from '@preeternal/react-native-cookie-manager';

import { WEB_VIEW_COOKIE_STORE } from '../../../shared/config';
import type { StoredCookie } from './cookie-persistence.types';
import { toStoredCookieHelper } from './to-stored-cookie.helper';
import { visitedHosts } from './visited-hosts';

const readAllCookies = async () => {
  if (Platform.OS === 'ios') {
    const cookies = await CookieManager.getAllAsArray(WEB_VIEW_COOKIE_STORE);
    return cookies.map(cookie => toStoredCookieHelper(cookie));
  }
  // Android has no "all cookies", only the cookies of a specific URL
  const perHost = await Promise.all(
    visitedHosts.get().map(host =>
      CookieManager.getAsArray(`https://${host}/`)
        .then(cookies =>
          cookies.map(cookie => toStoredCookieHelper(cookie, host)),
        )
        .catch(() => []),
    ),
  );
  return perHost.flat();
};

/**
 * Reads the cookies of all WebViews without duplicates: on Android a domain
 * cookie comes from each of its hosts.
 */
export const readWebViewCookiesHelper = async () => {
  const unique = new Map<string, StoredCookie>();
  for (const stored of await readAllCookies()) {
    if (stored) {
      const { url, cookie } = stored;
      unique.set(`${url} ${cookie.domain ?? ''} ${cookie.name}`, stored);
    }
  }
  return [...unique.values()];
};
