import { NOTIFICATIONS } from '../config/notifications';
import { mapRemoteMessageToNotificationHelper } from './map-remote-message-to-notification.helper';

describe('mapRemoteMessageToNotificationHelper', () => {
  it('copies title, body and data from the FCM message', () => {
    const notification = mapRemoteMessageToNotificationHelper({
      notification: { title: 'Sale', body: 'Up to 50% off' },
      data: { url: 'https://example.com/sale' },
    });

    expect(notification).toMatchObject({
      title: 'Sale',
      body: 'Up to 50% off',
      data: { url: 'https://example.com/sale' },
    });
  });

  it('shows the notification in the push channel and opens the app on tap', () => {
    const notification = mapRemoteMessageToNotificationHelper({
      notification: { title: 'Sale' },
    });

    expect(notification.android).toEqual({
      channelId: NOTIFICATIONS.channelId,
      pressAction: { id: 'default' },
    });
  });

  it('leaves title and body empty without a notification payload', () => {
    const notification = mapRemoteMessageToNotificationHelper({
      data: { url: 'https://example.com/sale' },
    });

    expect(notification.title).toBeUndefined();
    expect(notification.body).toBeUndefined();
  });
});
