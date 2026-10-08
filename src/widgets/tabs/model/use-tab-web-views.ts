import { useMemo, useRef } from 'react';

import type { WebViewControls } from '../../../shared/lib';
import type { TabWebViews } from './tabs.types';

/**
 * Keeps the WebView of every tab by its key, so the navigation can control
 * the pages: track whether a tab can go back, go back, and reset a tab to
 * its root URL.
 */
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
