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

export const useNetworkStatus = () => {
  const { isConnected, isInternetReachable } = useNetInfo();

  return { isOnline: toIsOnline(isConnected, isInternetReachable) };
};
