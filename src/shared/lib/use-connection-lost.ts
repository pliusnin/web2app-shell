import { useEffect, useEffectEvent, useRef } from 'react';
import { useNetInfo } from '@react-native-community/netinfo';

const toIsOnline = (
  isConnected: boolean | null,
  isInternetReachable: boolean | null,
) => {
  if (isConnected === false || isInternetReachable === false) {
    return false;
  }
  if (isConnected === null || isInternetReachable === null) {
    return null;
  }
  return true;
};

/**
 * Calls the handler when the connection drops. Fires only on a transition
 * from online to offline: starting without network, and while NetInfo does
 * not know anything yet, are not changes.
 */
export const useConnectionLost = (onLost: () => void) => {
  const { isConnected, isInternetReachable } = useNetInfo();
  const isOnline = toIsOnline(isConnected, isInternetReachable);
  const wasOnline = useRef<boolean | null>(null);
  const onConnectionLost = useEffectEvent(onLost);

  useEffect(() => {
    if (isOnline === null) {
      return;
    }
    if (wasOnline.current && !isOnline) {
      onConnectionLost();
    }
    wasOnline.current = isOnline;
  }, [isOnline]);
};
