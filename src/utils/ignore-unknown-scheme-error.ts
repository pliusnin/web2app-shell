import type { WebViewProps } from 'react-native-webview';

type ErrorHandler = NonNullable<WebViewProps['onError']>;

const ERR_UNKNOWN_URL_SCHEME = -10;

// Android reports this error for tel:, mailto: and other app links even after
// onShouldStartLoadWithRequest blocked them. Such links open outside the app,
// so the page stays instead of the WebView's error screen
export const ignoreUnknownSchemeError: ErrorHandler = event => {
  if (event.nativeEvent.code === ERR_UNKNOWN_URL_SCHEME) {
    event.preventDefault();
  }
};
