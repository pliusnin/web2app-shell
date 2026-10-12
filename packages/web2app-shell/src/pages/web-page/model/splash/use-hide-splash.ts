import { useEffect } from 'react';

import { hideSplashHelper, useNetworkStatus } from '../../../../shared/lib';

/**
 * Hides the splash once the page has shown something (the page or an error
 * screen), or right away when the device is offline, so the user isn't stuck
 * on the splash.
 */
export const useHideSplash = (isPageSettled: boolean) => {
  const { isOnline } = useNetworkStatus();
  const shouldHide = isPageSettled || isOnline === false;

  useEffect(() => {
    if (shouldHide) {
      hideSplashHelper();
    }
  }, [shouldHide]);
};
