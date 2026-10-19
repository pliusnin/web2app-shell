import { Platform } from 'react-native';

import type { ShouldStartLoadRequest } from '../../../shared/lib';
import { isAppUrlHelper } from './is-app-url.helper';

/**
 * Решает, может ли WebView загрузить запрос: страницы встроенного сайта
 * грузятся внутри, всё остальное нужно открывать вне приложения.
 */
export const shouldLoadInAppHelper = ({
  url,
  isTopFrame,
}: ShouldStartLoadRequest) => {
  // iOS спрашивает и про загрузки iframe (карты, аналитика) — они должны
  // оставаться внутри страницы
  if (Platform.OS === 'ios' && !isTopFrame) {
    return true;
  }
  return isAppUrlHelper(url);
};
