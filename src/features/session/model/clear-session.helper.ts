import {
  clearSecureItemHelper,
  readSecureItemHelper,
} from '../../../shared/lib';
import { SESSION_STORAGE_SERVICE } from '../config/session-storage';
import { removeSessionCookiesHelper } from './remove-session-cookies.helper';
import type { StoredSession } from './session.types';

/**
 * Ends the session when the user signs out on the site: removes the token and
 * the cookies the app set for it.
 */
export const clearSessionHelper = async () => {
  const stored = await readSecureItemHelper<StoredSession>(
    SESSION_STORAGE_SERVICE,
  );
  await removeSessionCookiesHelper(stored?.cookieNames ?? []);
  await clearSecureItemHelper(SESSION_STORAGE_SERVICE);
};
