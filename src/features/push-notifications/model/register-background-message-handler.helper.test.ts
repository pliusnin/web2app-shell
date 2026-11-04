import { setBackgroundMessageHandler } from '@react-native-firebase/messaging';

import { registerBackgroundMessageHandlerHelper } from './register-background-message-handler.helper';

describe('registerBackgroundMessageHandlerHelper', () => {
  it('registers a handler that settles for any message', async () => {
    registerBackgroundMessageHandlerHelper();

    const [, handler] = jest.mocked(setBackgroundMessageHandler).mock.calls[0];

    await expect(
      handler({ notification: { title: 'Sale' } }),
    ).resolves.toBeUndefined();
  });
});
