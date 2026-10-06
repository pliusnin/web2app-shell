import { useRef } from 'react';
import type { WebViewNavigation } from 'react-native-webview';

import type { WebViewControls } from '../types';

export const useTabWebViews = () => {
  const webViews = useRef<Record<string, WebViewControls | null>>({});
  const canGoBack = useRef<Record<string, boolean>>({});

  return {
    ref: (key: string) => (webView: WebViewControls | null) => {
      webViews.current[key] = webView;
    },
    onNavigationStateChange: (key: string) => (navState: WebViewNavigation) => {
      canGoBack.current[key] = navState.canGoBack;
    },
    open: (key: string, uri: string) => {
      webViews.current[key]?.injectJavaScript(
        `window.location.href = ${JSON.stringify(uri)}; true;`,
      );
    },
    // Returns false when the tab has no history to go back to
    goBack: (key: string) => {
      if (!canGoBack.current[key]) {
        return false;
      }
      webViews.current[key]?.goBack();
      return true;
    },
  };
};
