import { Platform } from 'react-native';

import { useConfig } from '../config';
import type { ShouldStartLoadHandler } from '../types';
import { getHost, openExternalUrl } from '../utils';

export const useShouldStartLoadWithRequest = (): ShouldStartLoadHandler => {
  const { tabs } = useConfig();

  const isTabSite = (url: string) => {
    const host = getHost(url);
    return host !== undefined && tabs.some(tab => getHost(tab.url) === host);
  };

  return ({ url, isTopFrame }) => {
    // iOS also asks about iframe loads (reCAPTCHA, analytics) — they must stay inside the page
    const isIosSubFrame = Platform.OS === 'ios' && !isTopFrame;
    if (isIosSubFrame || isTabSite(url)) {
      return true;
    }
    // Android waits for the answer only 250 ms, so the URL is opened without waiting
    openExternalUrl(url);

    return false;
  };
};
