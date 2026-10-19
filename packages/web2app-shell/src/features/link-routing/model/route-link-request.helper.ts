import type { ShouldStartLoadHandler } from '../../../shared/lib';
import { openExternalUrlHelper } from './open-external-url.helper';
import { shouldLoadInAppHelper } from './should-load-in-app.helper';

/**
 * Обработчик onShouldStartLoadWithRequest для WebView: страницы встроенного
 * сайта грузятся внутри, остальные ссылки открываются вне приложения
 * и блокируются в WebView.
 */
export const routeLinkRequestHelper: ShouldStartLoadHandler = request => {
  if (shouldLoadInAppHelper(request)) {
    return true;
  }
  // Android ждёт ответа всего 250 мс, поэтому URL открывается без ожидания
  openExternalUrlHelper(request.url);

  return false;
};
