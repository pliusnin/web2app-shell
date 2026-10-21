import { useEffect, useEffectEvent, useState } from 'react';

import { prepareSiteHelper } from '../../features/bundled-site';
import {
  restoreWebViewCookiesHelper,
  useCookieSaving,
} from '../../features/cookie-persistence';
import { applySessionHelper } from '../../features/session';
import type { CheckSession } from '../../features/session';
import { resetSecureStorageAfterInstallHelper } from '../../shared/lib';

// A slow Keychain or session check does not hold the app on the splash screen
// any longer
const SESSION_TIMEOUT_MS = 5000;

const restoreCookies = () =>
  resetSecureStorageAfterInstallHelper()
    .then(restoreWebViewCookiesHelper)
    .catch(console.warn);

/**
 * Prepares what the WebView needs before the first page: the bundled site on a
 * local server, cookies from the last launch and the saved session, if the app
 * has a check. Returns true when WebViews can be shown. Enables cookie saving
 * once they are restored.
 */
export const useWebViewsReady = (checkSession?: CheckSession) => {
  const [isSiteReady, setIsSiteReady] = useState(false);
  const [isSessionReady, setIsSessionReady] = useState(false);
  const [isRestored, setIsRestored] = useState(false);
  const applySession = useEffectEvent(
    () => checkSession && applySessionHelper(checkSession),
  );

  useEffect(() => {
    // A site that failed to start still opens: the WebView shows its own error
    // page
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
        // After restore: it brings back the session cookies of the previous
        // launch, which the session check replaces
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
