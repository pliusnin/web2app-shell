import { useMemo, useRef } from 'react';
import type { RefCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import type { WebViewNavigation } from 'react-native-webview';

import { useConfig } from '../config';
import { mergeRefs } from '../lib';
import { useHideSplash, useLinkRouting, usePageLoad } from '../model';
import type { WebViewControls } from '../model';
import { PageErrorOverlay } from './page-error-overlay';
import { ProgressBar } from './progress-bar';

type TabScreenProps = {
  ref: RefCallback<WebViewControls>;
  uri: string;
  onNavigationStateChange: (navState: WebViewNavigation) => void;
};

export const TabScreen = ({
  ref,
  uri,
  onNavigationStateChange,
}: TabScreenProps) => {
  const { userAgentSuffix, theme } = useConfig();
  const webView = useRef<WebViewControls | null>(null);
  const webViewRef = useMemo(() => mergeRefs(ref, webView), [ref]);
  const onShouldStartLoadWithRequest = useLinkRouting();
  const { webViewHandlers, isLoading, isSettled, progress, error, retry } =
    usePageLoad(webView);
  useHideSplash(isSettled);

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
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
          color={theme.primary}
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
