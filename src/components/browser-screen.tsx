import type { RefCallback } from 'react';
import { WebView } from 'react-native-webview';
import type { WebViewNavigation } from 'react-native-webview';

import { useConfig } from '../config';
import { useShouldStartLoadWithRequest } from '../hooks';
import type { WebViewControls } from '../hooks';
import { ignoreUnknownSchemeError } from '../utils';

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
  const onShouldStartLoadWithRequest = useShouldStartLoadWithRequest();

  return (
    <WebView
      ref={ref}
      source={{ uri }}
      applicationNameForUserAgent={userAgentSuffix}
      allowsBackForwardNavigationGestures
      onNavigationStateChange={onNavigationStateChange}
      // With the default whitelist the WebView opens tel:, mailto: itself
      // and never calls onShouldStartLoadWithRequest for them
      originWhitelist={['*']}
      onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
      onError={ignoreUnknownSchemeError}
    />
  );
};
