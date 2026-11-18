import type { MessageHandler } from '../../../../shared/lib';

/**
 * Makes one WebView onMessage handler out of several, skipping the ones that
 * are not set: every handler sees every message and ignores what is not its
 * own.
 */
export const joinMessageHandlersHelper =
  (...handlers: Array<MessageHandler | undefined>): MessageHandler =>
  event =>
    handlers.forEach(handler => handler?.(event));
