import { Platform } from 'react-native';

import { hideSplashHelper } from '../../../../shared/lib';
import type { ErrorHandler } from '../../../../shared/lib';

const ANDROID_UNKNOWN_URL_SCHEME = -10;

/**
 * Handles a failed WebView load: the WebView shows its own error page and
 * the splash is hidden, because a page that failed to load will never send
 * WEB_READY.
 */
export const handleLoadErrorHelper: ErrorHandler = event => {
  // Android reports this error for tel:, mailto: and other app links even if
  // onShouldStartLoadWithRequest blocked them and opened them externally:
  // the page stays the same
  if (
    Platform.OS === 'android' &&
    event.nativeEvent.code === ANDROID_UNKNOWN_URL_SCHEME
  ) {
    event.preventDefault();
    return;
  }
  hideSplashHelper();
};
