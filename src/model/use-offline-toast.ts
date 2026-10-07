import { showOfflineToastHelper } from './show-offline-toast-helper';
import { useNetworkChange } from './use-network-change';

// A loaded page stays on screen when the connection drops, so the user is only notified
export const useOfflineToast = () => {
  useNetworkChange({ onOffline: showOfflineToastHelper });
};
