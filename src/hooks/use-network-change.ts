import { useEffect, useEffectEvent, useRef } from 'react';

import { useNetworkStatus } from './use-network-status';

type NetworkChangeHandlers = {
  onOffline?: () => void;
  onOnline?: () => void;
};

export const useNetworkChange = ({
  onOffline,
  onOnline,
}: NetworkChangeHandlers) => {
  const { isOnline } = useNetworkStatus();
  const wasOnline = useRef(isOnline);
  const onChange = useEffectEvent((online: boolean) => {
    (online ? onOnline : onOffline)?.();
  });

  useEffect(() => {
    if (isOnline !== wasOnline.current) {
      onChange(isOnline);
    }
    wasOnline.current = isOnline;
  }, [isOnline]);
};
