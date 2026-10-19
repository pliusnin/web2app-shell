import { useEffect } from 'react';
import { AppState } from 'react-native';

import { saveWebViewCookiesHelper } from './save-web-view-cookies.helper';

/**
 * Сохраняет куки WebView каждый раз, когда приложение уходит с переднего
 * плана. Включать только после восстановления: сохранение до него затрёт
 * сохранённые куки пустым хранилищем.
 */
export const useCookieSaving = (isEnabled: boolean) => {
  useEffect(() => {
    if (!isEnabled) {
      return;
    }
    const subscription = AppState.addEventListener('change', state => {
      // Смахивание iOS-приложения в переключателе убивает его в inactive,
      // до background оно не доходит
      if (state === 'background' || state === 'inactive') {
        saveWebViewCookiesHelper();
      }
    });
    return () => subscription.remove();
  }, [isEnabled]);
};
