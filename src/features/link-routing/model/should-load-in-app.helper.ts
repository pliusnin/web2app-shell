import { Platform } from 'react-native';

import type { ShouldStartLoadRequest } from '../../../shared/lib';
import { isAppUrlHelper } from './is-app-url.helper';

export const shouldLoadInAppHelper = (
  { url, isTopFrame }: ShouldStartLoadRequest,
  startUrl: string,
) => {
  // iOS also asks about iframe loads (reCAPTCHA, analytics) — they must stay inside the page
  if (Platform.OS === 'ios' && !isTopFrame) {
    return true;
  }
  return isAppUrlHelper(url, startUrl);
};
