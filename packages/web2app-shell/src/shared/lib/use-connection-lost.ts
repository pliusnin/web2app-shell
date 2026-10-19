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
 * Вызывает обработчик, когда соединение пропадает. Срабатывает только при
 * переходе из онлайна в офлайн: старт без сети и пока NetInfo ещё ничего не
 * знает — не изменение.
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
