import { useRef, useState } from 'react';

/**
 * Recreates the WebView when its content process has terminated (for example
 * due to low memory): Android can no longer use that WebView. The new one
 * opens the page the old one was on. Returns the key and uri for the
 * WebView.
 */
export const useWebViewRecovery = (uri: string) => {
  const lastUrl = useRef(uri);
  const [instance, setInstance] = useState({ key: 0, uri });

  const recreate = () =>
    setInstance(({ key }) => ({ key: key + 1, uri: lastUrl.current }));

  return {
    key: instance.key,
    uri: instance.uri,
    trackUrl: (url: string) => {
      lastUrl.current = url;
    },
    onContentProcessDidTerminate: recreate,
    onRenderProcessGone: recreate,
  };
};
