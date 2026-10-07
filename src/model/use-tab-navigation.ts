import { useState } from 'react';

import { useAndroidBackHandler } from '../lib';
import type { TabRoute, TabWebViews } from './tabs.types';

export const useTabNavigation = (
  routes: Array<TabRoute>,
  startIndex: number,
  webViews: Pick<TabWebViews, 'resetToRoot' | 'tryGoBack'>,
) => {
  const [index, setIndex] = useState(startIndex);

  useAndroidBackHandler(() => webViews.tryGoBack(routes[index].key));

  const onIndexChange = (newIndex: number) => {
    const isReselect = newIndex === index;
    if (isReselect) {
      const { key, uri } = routes[index];
      webViews.resetToRoot(key, uri);
    }
    setIndex(newIndex);
  };

  return { index, onIndexChange };
};
