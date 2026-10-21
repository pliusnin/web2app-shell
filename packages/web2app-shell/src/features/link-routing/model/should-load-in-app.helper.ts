import { Platform } from 'react-native';

import type { ShouldStartLoadRequest } from '../../../shared/lib';
import { isAppUrlHelper } from './is-app-url.helper';

/**
 * Decides whether the WebView may load a request: pages of the bundled site
 * load inside, everything else must be opened outside the app.
 */
export const shouldLoadInAppHelper = ({
  url,
  isTopFrame,
}: ShouldStartLoadRequest) => {
  // iOS also asks about iframe loads (maps, analytics); they must stay inside
  // the page
  if (Platform.OS === 'ios' && !isTopFrame) {
    return true;
  }
  return isAppUrlHelper(url);
};
