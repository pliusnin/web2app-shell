import { useMemo, useRef, useState } from 'react';
import type { RefCallback } from 'react';

import type { WebViewControls } from '../../../shared/lib';
import type { TabSource, TabWebViews } from './tabs.types';

/**
 * Stores each tab's WebView by its key so navigation can manage the pages:
 * know whether a tab can go back, go back, and reset a tab to the root URL
 * by loading a fresh WebView on it.
 */
export const useTabWebViews = (): TabWebViews => {
  const webViews = useRef<Record<string, WebViewControls | null>>({});
  const refs = useRef<Record<string, RefCallback<WebViewControls>>>({});
  const canGoBack = useRef<Record<string, boolean>>({});
  // A tab has a source only once it has been reset
  const [sources, setSources] = useState<Partial<Record<string, TabSource>>>(
    {},
  );

  return useMemo<TabWebViews>(
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
      source: (key: string | number, uri: any) =>
        sources[key] ?? { uri, version: 0 },
      resetToRoot: (key, uri) => {
        canGoBack.current[key] = false;
        // WebView has no method to load a URL, and setting the same `source`
        // again changes nothing: a new version remounts the WebView on the URI
        setSources(current => ({
          ...current,
          [key]: { uri, version: (current[key]?.version ?? 0) + 1 },
        }));
      },
      tryGoBack: key => {
        if (!canGoBack.current[key]) {
          return false;
        }
        webViews.current[key]?.goBack();
        return true;
      },
    }),
    [sources],
  );
};
