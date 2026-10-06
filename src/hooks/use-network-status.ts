import { useNetInfo } from '@react-native-community/netinfo';

export const useNetworkStatus = () => {
  const { isConnected, isInternetReachable } = useNetInfo();

  return { isOnline: isConnected !== false && isInternetReachable !== false };
};
