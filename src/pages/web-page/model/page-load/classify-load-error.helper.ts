import { Platform } from 'react-native';

import type { WebViewError } from '../../../../shared/lib';
import type { LoadErrorKind } from './page-load-error.types';

const ANDROID_UNKNOWN_URL_SCHEME = -10;

// android.webkit.WebViewClient: HOST_LOOKUP, CONNECT, IO, TIMEOUT
const ANDROID_NETWORK_CODES = [-2, -6, -7, -8];

// NSURLError: TimedOut, CannotFindHost, CannotConnectToHost,
// NetworkConnectionLost, NotConnectedToInternet, InternationalRoamingOff,
// DataNotAllowed
const IOS_NETWORK_CODES = [-1001, -1003, -1004, -1005, -1009, -1018, -1020];

/**
 * Sorts a WebView load error: network (no connection, the offline screen is
 * shown), ignored (Android error for app links that already opened outside),
 * other (left to the WebView).
 */
export const classifyLoadErrorHelper = ({
  code,
  domain,
}: WebViewError): LoadErrorKind => {
  if (Platform.OS === 'android') {
    // Android reports this error for tel:, mailto: and other app links even after
    // onShouldStartLoadWithRequest blocked them. Such links open outside the app
    if (code === ANDROID_UNKNOWN_URL_SCHEME) {
      return 'ignored';
    }
    return ANDROID_NETWORK_CODES.includes(code) ? 'network' : 'other';
  }
  return domain === 'NSURLErrorDomain' && IOS_NETWORK_CODES.includes(code)
    ? 'network'
    : 'other';
};
