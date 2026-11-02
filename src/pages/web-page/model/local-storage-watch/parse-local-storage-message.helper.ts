import { isAppUrlHelper } from '../../../../features/link-routing';
import type { LocalStorageKeyMessage } from './local-storage-watch.types';

/**
 * Reads whether the watched localStorage key has a value from a WebView
 * message. Messages of other origins and anything else the page posts give
 * undefined.
 */
export const parseLocalStorageMessageHelper = (
  { url, data }: { url: string; data: string },
  pageUri: string,
): boolean | undefined => {
  // Any frame can post: iOS reports the URL of the frame that posted, Android
  // its origin, so a foreign iframe is cut off here
  if (!isAppUrlHelper(url, pageUri)) {
    return undefined;
  }
  try {
    const message: Partial<LocalStorageKeyMessage> = JSON.parse(data);
    const hasValue = message?.args?.hasValue;
    return message?.cmd === 'LOCAL_STORAGE_KEY' && typeof hasValue === 'boolean'
      ? hasValue
      : undefined;
  } catch {
    return undefined;
  }
};
