import type { ShouldStartLoadHandler } from '../../../shared/lib';
import { openExternalUrlHelper } from './open-external-url.helper';
import { shouldLoadInAppHelper } from './should-load-in-app.helper';

/**
 * The onShouldStartLoadWithRequest handler for the WebView: pages of the
 * bundled site load inside, other links open outside the app and are blocked
 * in the WebView.
 */
export const routeLinkRequestHelper: ShouldStartLoadHandler = request => {
  if (shouldLoadInAppHelper(request)) {
    return true;
  }
  // Android waits for the answer only 250 ms, so the URL is opened without
  // waiting
  openExternalUrlHelper(request.url);

  return false;
};
