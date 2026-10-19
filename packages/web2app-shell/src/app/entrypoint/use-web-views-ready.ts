import { useEffect, useEffectEvent, useState } from 'react';

import { prepareSiteHelper } from '../../features/bundled-site';
import {
  restoreWebViewCookiesHelper,
  useCookieSaving,
} from '../../features/cookie-persistence';
import { applySessionHelper } from '../../features/session';
import type { CheckSession } from '../../features/session';
import { resetSecureStorageAfterInstallHelper } from '../../shared/lib';

// Медленный Keychain или проверка сессии не держат приложение на сплэше дольше
const SESSION_TIMEOUT_MS = 5000;

const restoreCookies = () =>
  resetSecureStorageAfterInstallHelper()
    .then(restoreWebViewCookiesHelper)
    .catch(console.warn);

/**
 * Готовит всё, что нужно WebView до загрузки первой страницы: встроенный сайт
 * на локальном сервере, куки прошлого запуска и сохранённую сессию, если у
 * приложения есть проверка. Возвращает true, когда WebView можно показать.
 * Включает сохранение кук после их восстановления.
 */
export const useWebViewsReady = (checkSession?: CheckSession) => {
  const [isSiteReady, setIsSiteReady] = useState(false);
  const [isSessionReady, setIsSessionReady] = useState(false);
  const [isRestored, setIsRestored] = useState(false);
  const applySession = useEffectEvent(
    () => checkSession && applySessionHelper(checkSession),
  );

  useEffect(() => {
    // Сайт, который не запустился, всё равно открывается: WebView покажет свою страницу ошибки
    prepareSiteHelper()
      .catch(console.warn)
      .finally(() => setIsSiteReady(true));

    const timeout = setTimeout(
      () => setIsSessionReady(true),
      SESSION_TIMEOUT_MS,
    );
    restoreCookies()
      .then(() => {
        setIsRestored(true);
        // После восстановления: оно возвращает куки сессии прошлого запуска,
        // которые проверка сессии заменяет
        return applySession();
      })
      .catch(console.warn)
      .finally(() => {
        clearTimeout(timeout);
        setIsSessionReady(true);
      });

    return () => clearTimeout(timeout);
  }, []);

  useCookieSaving(isRestored);

  return isSiteReady && isSessionReady;
};
