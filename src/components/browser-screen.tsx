import type { RefCallback } from 'react';
import { WebView } from 'react-native-webview';
import type { WebViewNavigation } from 'react-native-webview';

import { useConfig } from '../config';
import type { WebViewControls } from '../hooks';

type BrowserScreenProps = {
  ref: RefCallback<WebViewControls>;
  uri: string;
  onNavigationStateChange: (navState: WebViewNavigation) => void;
};

export const BrowserScreen = ({
  ref,
  uri,
  onNavigationStateChange,
}: BrowserScreenProps) => {
  const { userAgentSuffix } = useConfig();

  return (
    <WebView
      ref={ref}
      source={{ uri }}
      applicationNameForUserAgent={userAgentSuffix}
      allowsBackForwardNavigationGestures
      onNavigationStateChange={onNavigationStateChange}
    />
  );
};
