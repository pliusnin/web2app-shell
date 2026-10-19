import { Platform } from 'react-native';

import { getHostHelper } from '../../../shared/lib';
import { visitedHosts } from './visited-hosts';

/**
 * Запоминает хост страницы, открытой в WebView. Android читает куки только
 * по URL, поэтому его куки сохраняются по запомненным хостам. iOS читает все
 * куки сразу, хосты ему не нужны.
 */
export const trackVisitedHostHelper = (url: string) => {
  const host = getHostHelper(url);
  if (Platform.OS === 'android' && host) {
    visitedHosts.add([host]);
  }
};
