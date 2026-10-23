import notifee from 'react-native-notify-kit';

import { displayRemoteMessageHelper } from './display-remote-message.helper';
import { mapRemoteMessageToNotificationHelper } from './map-remote-message-to-notification.helper';

describe('displayRemoteMessageHelper', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows a notification message as a system notification', async () => {
    const message = {
      notification: { title: 'Sale', body: 'Up to 50% off' },
      data: { url: 'https://example.com/sale' },
    };

    await displayRemoteMessageHelper(message);

    expect(notifee.displayNotification).toHaveBeenCalledWith(
      mapRemoteMessageToNotificationHelper(message),
    );
  });

  it('skips data-only messages', async () => {
    await displayRemoteMessageHelper({
      data: { url: 'https://example.com/sale' },
    });

    expect(notifee.displayNotification).not.toHaveBeenCalled();
  });
});
