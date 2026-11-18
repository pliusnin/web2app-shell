import { useEffect } from 'react';

import { hideSplashHelper } from '../../../../shared/lib';

// A page that hangs on a slow network does not hold the splash any longer
const SPLASH_TIMEOUT_MS = 8000;

/**
 * Hides the native splash once the page has finished loading, successfully or
 * not, so the user does not see an empty WebView at startup. Returns the
 * `onLoadEnd` handler for the WebView. A page that never finishes loading
 * loses the splash after a timeout.
 */
export const useSplashHide = () => {
  useEffect(() => {
    const timeout = setTimeout(hideSplashHelper, SPLASH_TIMEOUT_MS);
    return () => clearTimeout(timeout);
  }, []);

  return { onLoadEnd: hideSplashHelper };
};
