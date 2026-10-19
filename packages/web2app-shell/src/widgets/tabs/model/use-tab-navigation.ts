import { useState } from 'react';

import { openExternalUrlHelper } from '../../../features/link-routing';
import { useAndroidBackHandler } from '../../../shared/lib';
import type { TabRoute, TabWebViews } from './tabs.types';

/**
 * Хранит выбранный таб и обрабатывает нажатия на табы: внешний таб открывает
 * свой URL вне приложения, повторное нажатие на активный таб возвращает его
 * к корневому URL таба. Кнопка «назад» Android идёт назад по истории
 * активного таба.
 */
export const useTabNavigation = (
  routes: Array<TabRoute>,
  startIndex: number,
  webViews: Pick<TabWebViews, 'resetToRoot' | 'tryGoBack'>,
) => {
  const [index, setIndex] = useState(startIndex);

  useAndroidBackHandler(() => webViews.tryGoBack(routes[index].key));

  const onIndexChange = (newIndex: number) => {
    const { key, uri, isExternal } = routes[newIndex];
    if (isExternal) {
      openExternalUrlHelper(uri);
      return;
    }
    const isReselect = newIndex === index;
    if (isReselect) {
      webViews.resetToRoot(key, uri);
    }
    setIndex(newIndex);
  };

  return { index, onIndexChange };
};
