import type { BridgeMessage } from './bridge.types';

/**
 * Превращает data сообщения WebView в команду моста, а всё остальное, что
 * может прислать страница, — в null.
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
