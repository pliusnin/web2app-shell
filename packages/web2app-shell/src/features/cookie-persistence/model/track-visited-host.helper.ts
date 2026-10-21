import { Platform } from 'react-native';

import { getHostHelper } from '../../../shared/lib';
import { visitedHosts } from './visited-hosts';

/**
 * Remembers the host of the page opened in the WebView. Android reads cookies
 * only by URL, so its cookies are saved per remembered host. iOS reads all
 * cookies at once and needs no hosts.
 */
export const trackVisitedHostHelper = (url: string) => {
  const host = getHostHelper(url);
  if (Platform.OS === 'android' && host) {
    visitedHosts.add([host]);
  }
};
