import type { RefCallback } from 'react';
import type { ImageSourcePropType } from 'react-native';
import type { WebViewNavigation } from 'react-native-webview';

import type { WebViewControls } from './web-view.types';

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
