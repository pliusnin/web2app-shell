import { useMemo, useRef } from 'react';
import type { RefCallback } from 'react';
import { WebView } from 'react-native-webview';
import type { WebViewNavigation } from 'react-native-webview';

import { trackVisitedHostHelper } from '../../../features/cookie-persistence';
import { routeLinkRequestHelper } from '../../../features/link-routing';
import { useConfig } from '../../../shared/config';
import { mergeRefsHelper } from '../../../shared/lib';
import type { WebViewControls } from '../../../shared/lib';
import { useFileDownload } from '../model/file-download/use-file-download';
import { joinScriptsHelper } from '../model/injected-scripts/join-scripts.helper';
import { handleLoadErrorHelper } from '../model/load-error/handle-load-error.helper';
import { useLocalStorageWatch } from '../model/local-storage-watch/use-local-storage-watch';
import { joinMessageHandlersHelper } from '../model/messages/join-message-handlers.helper';
import { useWebViewRecovery } from '../model/process-recovery/use-web-view-recovery';
import { useSplashHide } from '../model/splash/use-splash-hide';
import { LoadErrorView } from './load-error-view';

type WebPageScreenProps = {
  ref: RefCallback<WebViewControls>;
  uri: string;
  onNavigationStateChange: (navState: WebViewNavigation) => void;
  localStorageKey?: string;
  onLocalStorageKeyChange?: (hasValue: boolean) => void;
  customInjectedJavascript?: string;
};

export const WebPageScreen = ({
  ref,
  uri,
  onNavigationStateChange,
  localStorageKey,
  onLocalStorageKeyChange,
  customInjectedJavascript,
}: WebPageScreenProps) => {
  const { userAgentSuffix } = useConfig();
  const webView = useRef<WebViewControls | null>(null);
  const webViewRef = useMemo(() => mergeRefsHelper(ref, webView), [ref]);
  const recovery = useWebViewRecovery(uri);
  const splash = useSplashHide();
  const fileDownload = useFileDownload(uri);
  const localStorageWatch = useLocalStorageWatch(
    uri,
    localStorageKey,
    onLocalStorageKeyChange,
  );

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
      onShouldStartLoadWithRequest={request =>
        routeLinkRequestHelper(request, uri)
      }
      onError={handleLoadErrorHelper}
      onLoadEnd={splash.onLoadEnd}
      renderError={() => (
        <LoadErrorView onRetry={() => webView.current?.reload()} />
      )}
      onContentProcessDidTerminate={recovery.onContentProcessDidTerminate}
      onRenderProcessGone={recovery.onRenderProcessGone}
      injectedJavaScriptBeforeContentLoaded={
        localStorageWatch.injectedJavaScriptBeforeContentLoaded
      }
      injectedJavaScript={joinScriptsHelper(
        customInjectedJavascript,
        localStorageWatch.injectedJavaScript,
      )}
      onMessage={joinMessageHandlersHelper(
        localStorageWatch.onMessage,
        fileDownload,
      )}
      sharedCookiesEnabled={true}
      bounces={false}
      // iOS draws the tab bar over the page; "automatic" insets the scroll
      // view by its height (0 while hidden). The WebView default is "never".
      contentInsetAdjustmentBehavior="automatic"
    />
  );
};
