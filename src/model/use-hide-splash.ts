import { useEffect } from 'react';

import { hideSplash } from './hide-splash';
import { useNetworkStatus } from './use-network-status';

export const useHideSplash = (isPageSettled: boolean) => {
  const { isOnline } = useNetworkStatus();
  const shouldHide = isPageSettled || isOnline === false;

  useEffect(() => {
    if (shouldHide) {
      hideSplash();
    }
  }, [shouldHide]);
};
