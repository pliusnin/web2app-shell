import { useState } from 'react';

import { openExternalUrlHelper } from '../../../features/link-routing';
import { useAndroidBackHandler } from '../../../shared/lib';
import type { TabRoute, TabWebViews } from './tabs.types';

/**
 * Stores the selected tab and handles tab presses: an external tab opens
 * its URL outside the app, pressing the active tab again returns it to the
 * tab's root URL. The Android "back" button goes back through the active
 * tab's history.
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
