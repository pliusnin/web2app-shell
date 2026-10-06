import type { RefCallback } from 'react';
import type { ImageSourcePropType } from 'react-native';
import type { MaterialDesignIconsIconName } from '@react-native-vector-icons/material-design-icons/static';
import type {
  WebView,
  WebViewNavigation,
  WebViewProps,
} from 'react-native-webview';

export type PageError = { type: 'offline' } | { type: 'http'; status: number };

export type PageLoadState = {
  isLoading: boolean;
  progress: number;
  error: PageError | null;
  hasShownPage: boolean;
};

export type PageLoadEvent =
  | { type: 'loadStarted' }
  | { type: 'progressChanged'; progress: number }
  | { type: 'loadFinished' }
  | { type: 'loadFailed'; error: PageError }
  | { type: 'loadStopped' };

export type ErrorScreenContent = {
  icon: MaterialDesignIconsIconName;
  title: string;
  message: string;
};

export type LoadErrorKind = 'ignored' | 'network' | 'other';

export type HttpErrorOutcome =
  'showErrorScreen' | 'abortToErrorScreen' | 'abortToCurrentPage';

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

export type TabRoute = {
  key: string;
  title: string;
  uri: string;
  focusedIcon?: ImageSourcePropType;
};

export type TabWebViews = {
  ref: (key: string) => RefCallback<WebViewControls>;
  onNavigationStateChange: (
    key: string,
  ) => (navState: WebViewNavigation) => void;
  resetToRoot: (key: string, uri: string) => void;
  tryGoBack: (key: string) => boolean;
};
