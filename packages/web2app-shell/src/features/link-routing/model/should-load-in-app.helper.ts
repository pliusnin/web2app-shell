import { Platform } from 'react-native';

import type { ShouldStartLoadRequest } from '../../../shared/lib';
import { isAppUrlHelper } from './is-app-url.helper';

/**
 * Decides whether the WebView may load the request: pages of the app domain
 * load inside, everything else has to be opened outside the app.
 */
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
