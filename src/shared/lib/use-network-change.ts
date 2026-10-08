import { useEffect, useEffectEvent, useRef } from 'react';

import { useNetworkStatus } from './use-network-status';

type NetworkChangeHandlers = {
  onOffline?: () => void;
  onOnline?: () => void;
};

/**
 * Calls onOffline / onOnline when the connection is lost or comes back.
 * The first known status doesn't fire, only real changes, so nothing
 * happens on app start.
 */
export const useNetworkChange = ({
  onOffline,
  onOnline,
}: NetworkChangeHandlers) => {
  const { isOnline } = useNetworkStatus();
  const lastKnownOnline = useRef<boolean | null>(null);
  const onChange = useEffectEvent((online: boolean) => {
    (online ? onOnline : onOffline)?.();
  });

  useEffect(() => {
    if (isOnline === null) {
      return;
    }
    if (
      lastKnownOnline.current !== null &&
      lastKnownOnline.current !== isOnline
    ) {
      onChange(isOnline);
    }
    lastKnownOnline.current = isOnline;
  }, [isOnline]);
};
