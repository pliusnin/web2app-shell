import { useMemo, useRef } from 'react';
import type { RefCallback } from 'react';

import { callPageScriptHelper } from '../../../shared/bridge';
import type { WebViewControls } from '../../../shared/lib';
import type { TabWebViews } from './tabs.types';

/**
 * Хранит WebView каждого таба по его ключу, чтобы навигация управляла
 * страницами: знала, может ли таб вернуться назад, возвращала назад и
 * сбрасывала таб на корневой URL без перезагрузки.
 */
export const useTabWebViews = (): TabWebViews => {
  const webViews = useRef<Record<string, WebViewControls | null>>({});
  const refs = useRef<Record<string, RefCallback<WebViewControls>>>({});
  const canGoBack = useRef<Record<string, boolean>>({});

  return useMemo(
    () => ({
      // Один колбэк на ключ: новый ref на каждом рендере заставил бы React
      // отвязывать и снова привязывать WebView
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
