import {
  clearSecureItemHelper,
  readSecureItemHelper,
} from '../../../shared/lib';
import { SESSION_STORAGE_SERVICE } from '../config/session-storage';
import { removeSessionCookiesHelper } from './remove-session-cookies.helper';
import type { StoredSession } from './session.types';

/**
 * Завершает сессию, когда пользователь выходит на сайте: удаляет токен и
 * куки, которые приложение поставило для него.
 */
export const clearSessionHelper = async () => {
  const stored = await readSecureItemHelper<StoredSession>(
    SESSION_STORAGE_SERVICE,
  );
  await removeSessionCookiesHelper(stored?.cookieNames ?? []);
  await clearSecureItemHelper(SESSION_STORAGE_SERVICE);
};
