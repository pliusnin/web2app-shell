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
 * Returns whether the device is online: true or false once NetInfo knows,
 * null while the connection or internet reachability is still unknown, so
 * callers don't react to the unknown state on start.
 */
export const useNetworkStatus = () => {
  const { isConnected, isInternetReachable } = useNetInfo();

  return { isOnline: toIsOnline(isConnected, isInternetReachable) };
};
