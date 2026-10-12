import { useNetworkChange } from '../../../shared/lib';
import { showOfflineToastHelper } from './show-offline-toast.helper';

/**
 * Shows a toast when the connection drops. A loaded page stays on screen
 * while offline, so the user is only notified, without an error screen.
 */
export const useOfflineToast = () => {
  useNetworkChange({ onOffline: showOfflineToastHelper });
};
