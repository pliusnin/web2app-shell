import { useConfig } from '../../../shared/config';
import type { ShouldStartLoadHandler } from '../../../shared/lib';
import { openExternalUrlHelper } from './open-external-url.helper';
import { shouldLoadInAppHelper } from './should-load-in-app.helper';

/**
 * Returns the onShouldStartLoadWithRequest handler for the WebView: links of
 * the app domain load inside, other links open outside the app and are
 * blocked in the WebView.
 */
export const useLinkRouting = (): ShouldStartLoadHandler => {
  const { startUrl } = useConfig();

  return request => {
    if (shouldLoadInAppHelper(request, startUrl)) {
      return true;
    }
    // Android waits for the answer only 250 ms, so the URL is opened without waiting
    openExternalUrlHelper(request.url);

    return false;
  };
};
