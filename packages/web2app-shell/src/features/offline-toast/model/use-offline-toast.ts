import { useConnectionLost } from '../../../shared/lib';
import { showOfflineToastHelper } from './show-offline-toast.helper';

/**
 * Показывает тост, когда пропадает соединение. Загруженная страница остаётся
 * на экране и без сети, поэтому пользователя только предупреждают, без
 * экрана ошибки.
 */
export const useOfflineToast = () => {
  useConnectionLost(showOfflineToastHelper);
};
