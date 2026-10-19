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
  // В Android нет «всех кук», только куки конкретного URL
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
 * Читает куки всех WebView без дублей: в Android кука домена приходит с
 * каждого его хоста.
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
