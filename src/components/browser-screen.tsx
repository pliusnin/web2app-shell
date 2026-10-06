import { useRef } from 'react';
import type { RefCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import type { WebViewNavigation } from 'react-native-webview';

import { useConfig } from '../config';
import { DEFAULT_PRIMARY_COLOR } from '../constants';
import { usePageLoad, useShouldStartLoadWithRequest } from '../hooks';
import type { WebViewControls } from '../types';
import { mergeRefs } from '../utils';
import { PageErrorOverlay } from './page-error-overlay';
import { ProgressBar } from './progress-bar';

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
  const { userAgentSuffix, theme } = useConfig();
  const webView = useRef<WebViewControls | null>(null);
  const onShouldStartLoadWithRequest = useShouldStartLoadWithRequest();
  const { webViewHandlers, isLoading, progress, error, retry } =
    usePageLoad(webView);

  return (
    <View style={styles.container}>
      <WebView
        ref={mergeRefs(ref, webView)}
        source={{ uri }}
        applicationNameForUserAgent={userAgentSuffix}
        allowsBackForwardNavigationGestures
        onNavigationStateChange={onNavigationStateChange}
        originWhitelist={['*']}
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
        {...webViewHandlers}
      />
      {isLoading && (
        <ProgressBar
          style={styles.progress}
          progress={progress}
          color={theme.primary ?? DEFAULT_PRIMARY_COLOR}
        />
      )}
      <PageErrorOverlay error={error} onRetry={retry} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  progress: { position: 'absolute', top: 0, left: 0, right: 0, height: 2 },
});
