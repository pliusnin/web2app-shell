import {
  readSecureItemHelper,
  writeSecureItemHelper,
} from '../../../shared/lib';
import { SESSION_STORAGE_SERVICE } from '../config/session-storage';
import type { StoredSession } from './session.types';

/**
 * Сохраняет токен, который сайт присылает после входа. Следующий запуск
 * проверит его до открытия сайта.
 */
export const saveSessionTokenHelper = async (token: string) => {
  const stored = await readSecureItemHelper<StoredSession>(
    SESSION_STORAGE_SERVICE,
  );
  await writeSecureItemHelper(SESSION_STORAGE_SERVICE, {
    token,
    cookieNames: stored?.cookieNames ?? [],
  });
};
