import type { WebView, WebViewProps } from 'react-native-webview';

export type WebViewControls = Pick<WebView, 'goBack' | 'injectJavaScript'>;

export type ErrorHandler = NonNullable<WebViewProps['onError']>;
export type MessageHandler = NonNullable<WebViewProps['onMessage']>;
export type ShouldStartLoadHandler = NonNullable<
  WebViewProps['onShouldStartLoadWithRequest']
>;

export type ShouldStartLoadRequest = Parameters<ShouldStartLoadHandler>[0];
