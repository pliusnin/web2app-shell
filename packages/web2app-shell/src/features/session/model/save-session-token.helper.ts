import {
  readSecureItemHelper,
  writeSecureItemHelper,
} from '../../../shared/lib';
import { SESSION_STORAGE_SERVICE } from '../config/session-storage';
import type { StoredSession } from './session.types';

/**
 * Saves the token the site sends after sign-in. The next launch checks it
 * before opening the site.
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
