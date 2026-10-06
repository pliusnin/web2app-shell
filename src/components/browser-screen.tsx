import type { RefCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { ProgressView } from '@react-native-community/progress-view';
import { WebView } from 'react-native-webview';
import type { WebViewNavigation } from 'react-native-webview';

import { useConfig } from '../config';
import { useLoadProgress, useShouldStartLoadWithRequest } from '../hooks';
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
  const { userAgentSuffix, theme } = useConfig();
  const onShouldStartLoadWithRequest = useShouldStartLoadWithRequest();
  const { progress, isLoading, onLoadStart, onLoadProgress, onLoadEnd } =
    useLoadProgress();

  return (
    <View style={styles.container}>
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
        onLoadStart={onLoadStart}
        onLoadProgress={onLoadProgress}
        onLoadEnd={onLoadEnd}
      />
      {isLoading && (
        <ProgressView
          style={styles.progress}
          progress={progress}
          progressTintColor={theme.primary}
          trackTintColor="transparent"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  // Overlays the page so the WebView doesn't jump when the bar appears
  progress: { position: 'absolute', top: 0, left: 0, right: 0, height: 2 },
});
