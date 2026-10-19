import { Platform } from 'react-native';

import { hideSplashHelper } from '../../../../shared/lib';
import type { ErrorHandler } from '../../../../shared/lib';

const ANDROID_UNKNOWN_URL_SCHEME = -10;

/**
 * Обрабатывает неудачную загрузку WebView: WebView показывает свою страницу
 * ошибки, а сплэш скрывается, потому что неудачно загруженная страница
 * никогда не отправит WEB_READY.
 */
export const handleLoadErrorHelper: ErrorHandler = event => {
  // Android сообщает об этой ошибке для tel:, mailto: и других ссылок
  // в приложения, даже если onShouldStartLoadWithRequest заблокировал их
  // и открыл снаружи: страница остаётся прежней
  if (
    Platform.OS === 'android' &&
    event.nativeEvent.code === ANDROID_UNKNOWN_URL_SCHEME
  ) {
    event.preventDefault();
    return;
  }
  hideSplashHelper();
};
