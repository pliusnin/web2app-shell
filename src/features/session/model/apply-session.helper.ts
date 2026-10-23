import CookieManager from '@preeternal/react-native-cookie-manager';

import { SITE_ORIGIN, WEB_VIEW_COOKIE_STORE } from '../../../shared/config';
import {
  clearSecureItemHelper,
  readSecureItemHelper,
  writeSecureItemHelper,
} from '../../../shared/lib';
import { SESSION_STORAGE_SERVICE } from '../config/session-storage';
import { removeSessionCookiesHelper } from './remove-session-cookies.helper';
import type { CheckSession, StoredSession } from './session.types';
import { toSiteCookiesHelper } from './to-site-cookies.helper';

/**
 * Checks the saved token and sets the site cookies from the check response so
 * the first page opens already signed in. An invalid token is removed; if the
 * check fails it is kept: the next launch checks it again. Must finish before
 * the first page loads.
 */
export const applySessionHelper = async (checkSession: CheckSession) => {
  const stored = await readSecureItemHelper<StoredSession>(
    SESSION_STORAGE_SERVICE,
  );
  if (!stored) {
    return;
  }
  await removeSessionCookiesHelper(stored.cookieNames);

  const response = await checkSession(stored.token);
  if (!response) {
    await clearSecureItemHelper(SESSION_STORAGE_SERVICE);
    return;
  }

  const cookies = toSiteCookiesHelper(response.headers.get('set-cookie') ?? '');
  await Promise.all(
    cookies.map(cookie =>
      CookieManager.set(SITE_ORIGIN, cookie, WEB_VIEW_COOKIE_STORE),
    ),
  );
  await writeSecureItemHelper(SESSION_STORAGE_SERVICE, {
    token: stored.token,
    cookieNames: cookies.map(({ name }) => name),
  });
};
