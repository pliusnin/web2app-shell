import CookieManager from '@preeternal/react-native-cookie-manager';

import { writeSecureItemHelper } from '../../../shared/lib';
import { COOKIE_STORAGE_SERVICE } from '../config/cookie-storage';
import type { StoredCookies } from './cookie-persistence.types';
import { readWebViewCookiesHelper } from './read-web-view-cookies.helper';
import { visitedHosts } from './visited-hosts';

let saving = Promise.resolve();

const save = async () => {
  // Android writes the cookie store to disk lazily
  await CookieManager.flush();
  const stored: StoredCookies = {
    hosts: visitedHosts.get(),
    cookies: await readWebViewCookiesHelper(),
  };
  await writeSecureItemHelper(COOKIE_STORAGE_SERVICE, stored);
};

/**
 * Saves the cookies of all WebViews to the Keychain. Saves run one after
 * another.
 */
export const saveWebViewCookiesHelper = () => {
  saving = saving.then(save).catch(console.warn);
  return saving;
};
