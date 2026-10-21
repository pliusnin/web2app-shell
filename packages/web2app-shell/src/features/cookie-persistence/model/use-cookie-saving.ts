import { useEffect } from 'react';
import { AppState } from 'react-native';

import { saveWebViewCookiesHelper } from './save-web-view-cookies.helper';

/**
 * Saves WebView cookies each time the app leaves the foreground. Enable only
 * after restore: saving before it would overwrite the saved cookies with an
 * empty store.
 */
export const useCookieSaving = (isEnabled: boolean) => {
  useEffect(() => {
    if (!isEnabled) {
      return;
    }
    const subscription = AppState.addEventListener('change', state => {
      // Swiping an iOS app away in the switcher kills it in inactive; it never
      // reaches background
      if (state === 'background' || state === 'inactive') {
        saveWebViewCookiesHelper();
      }
    });
    return () => subscription.remove();
  }, [isEnabled]);
};
