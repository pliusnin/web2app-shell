import { useCallback, useEffect, useRef, useState } from 'react';
import type { WebViewNavigation } from 'react-native-webview';

import { getOriginHelper, hasWebViewCookieHelper } from '../../../shared/lib';
import type { AuthToken } from './auth-token.types';
import type { TabRoute } from './tabs.types';

/**
 * Hides the tab bar while the site of the active tab has no auth token, so a
 * signed-out user stays on the sign-in page. A cookie is checked on a tab
 * switch and after every page load, a localStorage key is reported by the page
 * on every change. Pages of inactive tabs are ignored. No token: always shown.
 */
export const useTabBarHidden = (
  authToken: AuthToken | undefined,
  activeRoute: Pick<TabRoute, 'key' | 'uri'>,
) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const lastCheckId = useRef(0);
  // Read when a page reports, which can be after a tab switch
  const activeKey = useRef(activeRoute.key);
  const cookieName = authToken?.storage === 'cookie' ? authToken.key : '';
  const localStorageKey =
    authToken?.storage === 'localStorage' ? authToken.key : '';

  const checkCookie = useCallback(
    (url: string) => {
      if (!cookieName || !getOriginHelper(url)) {
        return;
      }
      const checkId = ++lastCheckId.current;
      hasWebViewCookieHelper(url, cookieName)
        .then(hasCookie => {
          // Checks may resolve out of order: only the latest page counts
          if (checkId === lastCheckId.current) {
            setIsSignedIn(hasCookie);
          }
        })
        .catch(console.warn);
    },
    [cookieName],
  );

  useEffect(() => {
    activeKey.current = activeRoute.key;
    checkCookie(activeRoute.uri);
  }, [checkCookie, activeRoute.key, activeRoute.uri]);

  return {
    isHidden: Boolean(authToken?.key) && !isSignedIn,
    localStorageKey: localStorageKey || undefined,
    onNavigationStateChange:
      (key: string) =>
      ({ url, loading }: WebViewNavigation) => {
        // The response's cookies are in the store once the page has loaded
        if (key === activeKey.current && !loading) {
          checkCookie(url);
        }
      },
    onLocalStorageKeyChange: (key: string) => (hasValue: boolean) => {
      if (key === activeKey.current) {
        setIsSignedIn(hasValue);
      }
    },
  };
};
