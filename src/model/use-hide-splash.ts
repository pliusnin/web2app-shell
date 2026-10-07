import { useEffect } from 'react';

import { hideSplashHelper } from './hide-splash-helper';
import { useNetworkStatus } from './use-network-status';

export const useHideSplash = (isPageSettled: boolean) => {
  const { isOnline } = useNetworkStatus();
  const shouldHide = isPageSettled || isOnline === false;

  useEffect(() => {
    if (shouldHide) {
      hideSplashHelper();
    }
  }, [shouldHide]);
};
