import { useEffect } from 'react';

import { hideSplashHelper, useNetworkStatus } from '../lib';

export const useHideSplash = (isPageSettled: boolean) => {
  const { isOnline } = useNetworkStatus();
  const shouldHide = isPageSettled || isOnline === false;

  useEffect(() => {
    if (shouldHide) {
      hideSplashHelper();
    }
  }, [shouldHide]);
};
