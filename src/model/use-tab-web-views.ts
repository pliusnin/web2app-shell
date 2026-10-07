import { useMemo, useRef } from 'react';

import type { TabWebViews } from './tabs.types';
import type { WebViewControls } from './web-view.types';

export const useTabWebViews = (): TabWebViews => {
  const webViews = useRef<Record<string, WebViewControls | null>>({});
  const canGoBack = useRef<Record<string, boolean>>({});

  return useMemo(
    () => ({
      ref: key => webView => {
        webViews.current[key] = webView;
      },
      onNavigationStateChange: key => navState => {
        canGoBack.current[key] = navState.canGoBack;
      },
      resetToRoot: (key, uri) => {
        webViews.current[key]?.injectJavaScript(
          `window.location.href = ${JSON.stringify(uri)}; true;`,
        );
      },
      tryGoBack: key => {
        if (!canGoBack.current[key]) {
          return false;
        }
        webViews.current[key]?.goBack();
        return true;
      },
    }),
    [],
  );
};
