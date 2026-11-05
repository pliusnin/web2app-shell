import { useEffect, useEffectEvent, useRef } from 'react';
import { useNetInfo } from '@react-native-community/netinfo';

/**
 * Calls the handler when the connection drops. Fires only on a transition
 * from online to offline: starting without network, and while NetInfo does
 * not know anything yet, are not changes.
 */
export const useConnectionLost = (onLost: () => void) => {
  const { isConnected, isInternetReachable } = useNetInfo();
  const isOnline = !!isConnected && !!isInternetReachable;
  const wasOnline = useRef<boolean | null>(true);
  const onConnectionLost = useEffectEvent(onLost);

  useEffect(() => {
    console.log('isOnline', isOnline, 'wasOnline.current', wasOnline.current);
    if (isOnline === null) {
      return;
    }
    if (wasOnline.current && !isOnline) {
      onConnectionLost();
    }
    wasOnline.current = isOnline;
  }, [isOnline]);
};
