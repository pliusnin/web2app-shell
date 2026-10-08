import { createElement } from 'react';

export const WebView = (props: object) =>
  createElement('RNCWebView', { testID: 'web-view', ...props });
