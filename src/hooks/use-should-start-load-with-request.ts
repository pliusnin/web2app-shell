import type { WebViewProps } from 'react-native-webview';

import { useConfig } from '../config';
import { getHost, openExternalUrl } from '../utils';

type ShouldStartLoadHandler = NonNullable<
  WebViewProps['onShouldStartLoadWithRequest']
>;

// Pages of the tabs' sites load in the WebView, other links open outside the app
export const useShouldStartLoadWithRequest = (): ShouldStartLoadHandler => {
  const { tabs } = useConfig();

  const isTabSite = (url: string) => {
    const host = getHost(url);
    return host !== undefined && tabs.some(tab => getHost(tab.url) === host);
  };

  return ({ url }) => {
    if (isTabSite(url)) {
      return true;
    }
    // Android waits for the answer only 250 ms, so the URL is opened without waiting
    openExternalUrl(url);

    return false;
  };
};
