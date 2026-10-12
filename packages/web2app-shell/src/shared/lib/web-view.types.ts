import type { WebView, WebViewProps } from 'react-native-webview';

export type WebViewControls = Pick<
  WebView,
  'goBack' | 'injectJavaScript' | 'reload' | 'stopLoading'
>;

export type ErrorHandler = NonNullable<WebViewProps['onError']>;
export type HttpErrorHandler = NonNullable<WebViewProps['onHttpError']>;
export type LoadProgressHandler = NonNullable<WebViewProps['onLoadProgress']>;
export type ShouldStartLoadHandler = NonNullable<
  WebViewProps['onShouldStartLoadWithRequest']
>;

export type WebViewError = Parameters<ErrorHandler>[0]['nativeEvent'];
export type ShouldStartLoadRequest = Parameters<ShouldStartLoadHandler>[0];
