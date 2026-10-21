import { useConnectionLost } from '../../../shared/lib';
import { showOfflineToastHelper } from './show-offline-toast.helper';

/**
 * Shows a toast when the connection drops. The loaded page stays on screen
 * even offline, so the user is only warned, without an error screen.
 */
export const useOfflineToast = () => {
  useConnectionLost(showOfflineToastHelper);
};
