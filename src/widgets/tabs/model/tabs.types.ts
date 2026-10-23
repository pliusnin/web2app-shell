import type { RefCallback } from 'react';
import type { ImageSourcePropType } from 'react-native';
import type { WebViewNavigation } from 'react-native-webview';

import type { WebViewControls } from '../../../shared/lib';

export type TabRoute = {
  key: string;
  title: string;
  uri: string;
  isExternal: boolean;
  focusedIcon?: ImageSourcePropType;
  unfocusedIcon?: ImageSourcePropType;
};

export type TabWebViews = {
  ref: (key: string) => RefCallback<WebViewControls>;
  onNavigationStateChange: (
    key: string,
  ) => (navState: WebViewNavigation) => void;
  resetToRoot: (key: string, uri: string) => void;
  tryGoBack: (key: string) => boolean;
};

export type TabScene = {
  ref: RefCallback<WebViewControls>;
  uri: string;
  onNavigationStateChange: (navState: WebViewNavigation) => void;
};
