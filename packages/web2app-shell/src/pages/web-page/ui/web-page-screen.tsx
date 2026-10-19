import { useMemo, useRef } from 'react';
import type { RefCallback } from 'react';
import { WebView } from 'react-native-webview';
import type { WebViewNavigation } from 'react-native-webview';

import { trackVisitedHostHelper } from '../../../features/cookie-persistence';
import { routeLinkRequestHelper } from '../../../features/link-routing';
import { useConfig } from '../../../shared/config';
import { mergeRefsHelper } from '../../../shared/lib';
import type { WebViewControls } from '../../../shared/lib';
import { useBridgeMessages } from '../model/bridge/use-bridge-messages';
import { handleLoadErrorHelper } from '../model/load-error/handle-load-error.helper';
import { useWebViewRecovery } from '../model/process-recovery/use-web-view-recovery';

type WebPageScreenProps = {
  ref: RefCallback<WebViewControls>;
  uri: string;
  onNavigationStateChange: (navState: WebViewNavigation) => void;
};

export const WebPageScreen = ({
  ref,
  uri,
  onNavigationStateChange,
}: WebPageScreenProps) => {
  const { userAgentSuffix } = useConfig();
  const webView = useRef<WebViewControls | null>(null);
  const webViewRef = useMemo(() => mergeRefsHelper(ref, webView), [ref]);
  const onMessage = useBridgeMessages(webView);
  const recovery = useWebViewRecovery(uri);

  return (
    <WebView
      key={recovery.key}
      ref={webViewRef}
      source={{ uri: recovery.uri }}
      applicationNameForUserAgent={userAgentSuffix}
      allowsBackForwardNavigationGestures
      onNavigationStateChange={navState => {
        onNavigationStateChange(navState);
        recovery.trackUrl(navState.url);
        trackVisitedHostHelper(navState.url);
      }}
      originWhitelist={['*']}
      onShouldStartLoadWithRequest={routeLinkRequestHelper}
      onMessage={onMessage}
      onError={handleLoadErrorHelper}
      onContentProcessDidTerminate={recovery.onContentProcessDidTerminate}
      onRenderProcessGone={recovery.onRenderProcessGone}
    />
  );
};
