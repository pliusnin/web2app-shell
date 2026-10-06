import { useState } from 'react';

import type { TabRoute } from '../types';
import { useAndroidBackHandler } from './use-android-back-handler';
import type { useTabWebViews } from './use-tab-web-views';

type TabWebViews = Pick<ReturnType<typeof useTabWebViews>, 'open' | 'goBack'>;

export const useTabNavigation = (
  routes: Array<TabRoute>,
  startIndex: number,
  webViews: TabWebViews,
) => {
  const [index, setIndex] = useState(startIndex);

  useAndroidBackHandler(() => webViews.goBack(routes[index].key));

  const onIndexChange = (newIndex: number) => {
    if (newIndex === index) {
      const { key, uri } = routes[index];
      webViews.open(key, uri);
    }
    setIndex(newIndex);
  };

  return { index, onIndexChange };
};
