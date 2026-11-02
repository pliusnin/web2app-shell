import { useMemo } from 'react';
import type { WebViewProps } from 'react-native-webview';

import { createLocalStorageWatchScriptHelper } from './create-local-storage-watch-script.helper';
import { parseLocalStorageMessageHelper } from './parse-local-storage-message.helper';

type LocalStorageWatchProps = Pick<
  WebViewProps,
  'injectedJavaScriptBeforeContentLoaded' | 'injectedJavaScript' | 'onMessage'
>;

/**
 * Returns WebView props that report whether the page's localStorage key has a
 * value, on load and on every change. Without a key the WebView gets no
 * script and no message handler.
 */
export const useLocalStorageWatch = (
  pageUri: string,
  key: string | undefined,
  onChange: ((hasValue: boolean) => void) | undefined,
): LocalStorageWatchProps => {
  const script = useMemo(
    () => (key ? createLocalStorageWatchScriptHelper(key) : undefined),
    [key],
  );
  if (!script || !onChange) {
    return {};
  }

  return {
    injectedJavaScriptBeforeContentLoaded: script,
    // Android injects the early script in onPageStarted, where it can land in
    // the previous document and be lost: then it installs after the load
    injectedJavaScript: script,
    onMessage: ({ nativeEvent }) => {
      const hasValue = parseLocalStorageMessageHelper(nativeEvent, pageUri);
      if (hasValue !== undefined) {
        onChange(hasValue);
      }
    },
  };
};
