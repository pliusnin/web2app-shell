import CookieManager, {
  type Cookie,
} from '@preeternal/react-native-cookie-manager';

import { WEB_VIEW_COOKIE_STORE } from '../../../shared/config';
import { readSecureItemHelper } from '../../../shared/lib';
import { COOKIE_STORAGE_SERVICE } from '../config/cookie-storage';
import type { StoredCookies } from './cookie-persistence.types';
import { isCookieExpiredHelper } from './is-cookie-expired.helper';
import { visitedHosts } from './visited-hosts';

const restoreMissing = async (url: string, cookies: Array<Cookie>) => {
  // Куки, которые WebView сохранил сам, свежее сохранённых
  const existing = await CookieManager.getAsArray(url, WEB_VIEW_COOKIE_STORE);
  const existingNames = new Set(existing.map(({ name }) => name));
  await Promise.all(
    cookies
      .filter(({ name }) => !existingNames.has(name))
      .map(cookie => CookieManager.set(url, cookie, WEB_VIEW_COOKIE_STORE)),
  );
};

/**
 * Возвращает в хранилище WebView куки, сохранённые прошлым запуском, —
 * только те, которых в нём нет. Должен завершиться до загрузки первой
 * страницы.
 */
export const restoreWebViewCookiesHelper = async () => {
  const stored = await readSecureItemHelper<StoredCookies>(
    COOKIE_STORAGE_SERVICE,
  );
  if (!stored) {
    return;
  }
  visitedHosts.add(stored.hosts);

  const byUrl = new Map<string, Array<Cookie>>();
  for (const { url, cookie } of stored.cookies) {
    if (!isCookieExpiredHelper(cookie)) {
      byUrl.set(url, [...(byUrl.get(url) ?? []), cookie]);
    }
  }
  await Promise.all(
    [...byUrl].map(([url, cookies]) =>
      restoreMissing(url, cookies).catch(console.warn),
    ),
  );
};
