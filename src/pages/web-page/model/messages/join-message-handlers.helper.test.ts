import type { MessageHandler } from '../../../../shared/lib';
import { joinMessageHandlersHelper } from './join-message-handlers.helper';

describe('joinMessageHandlersHelper', () => {
  it('passes a message to every handler that is set', () => {
    const first = jest.fn();
    const second = jest.fn();
    const event = {
      nativeEvent: { data: '{}' },
    } as Parameters<MessageHandler>[0];

    joinMessageHandlersHelper(first, undefined, second)(event);

    expect(first).toHaveBeenCalledWith(event);
    expect(second).toHaveBeenCalledWith(event);
  });
});
