import { useMemo, useRef } from 'react';
import type { RefCallback } from 'react';

import { callPageScriptHelper } from '../../../shared/bridge';
import type { WebViewControls } from '../../../shared/lib';
import type { TabWebViews } from './tabs.types';

/**
 * Stores each tab's WebView by its key so navigation can manage the pages:
 * know whether a tab can go back, go back, and reset a tab to the root URL
 * without reloading.
 */
export const useTabWebViews = (): TabWebViews => {
  const webViews = useRef<Record<string, WebViewControls | null>>({});
  const refs = useRef<Record<string, RefCallback<WebViewControls>>>({});
  const canGoBack = useRef<Record<string, boolean>>({});

  return useMemo(
    () => ({
      // One callback per key: a new ref on every render would make React
      // detach and reattach the WebView
      ref: key =>
        (refs.current[key] ??= webView => {
          webViews.current[key] = webView;
        }),
      onNavigationStateChange: key => navState => {
        canGoBack.current[key] = navState.canGoBack;
      },
      resetToRoot: (key, uri) => {
        webViews.current[key]?.injectJavaScript(
          callPageScriptHelper({
            fn: 'invoke',
            args: [{ cmd: 'CHANGE_LOCATION', args: { url: uri } }],
          }),
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
