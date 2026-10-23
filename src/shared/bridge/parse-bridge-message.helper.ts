import type { BridgeMessage } from './bridge.types';

/**
 * Turns the WebView message data into a bridge command, and anything else
 * the page may send into null.
 */
export const parseBridgeMessageHelper = (
  data: string,
): BridgeMessage | null => {
  try {
    const message = JSON.parse(data);
    return typeof message?.cmd === 'string' ? message : null;
  } catch {
    return null;
  }
};
