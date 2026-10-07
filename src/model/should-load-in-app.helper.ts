import { Platform } from 'react-native';

import { getHostHelper } from '../lib';
import type { ShouldStartLoadRequest } from './web-view.types';

export const shouldLoadInAppHelper = (
  { url, isTopFrame }: ShouldStartLoadRequest,
  appHosts: ReadonlySet<string>,
) => {
  // iOS also asks about iframe loads (reCAPTCHA, analytics) — they must stay inside the page
  if (Platform.OS === 'ios' && !isTopFrame) {
    return true;
  }
  const host = getHostHelper(url);
  return host !== undefined && appHosts.has(host);
};
