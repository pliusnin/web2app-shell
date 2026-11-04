import { logPushTokenHelper } from './log-push-token.helper';

describe('logPushTokenHelper', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('logs the FCM token in dev builds', async () => {
    const log = jest.spyOn(console, 'log').mockImplementation(() => {});

    await logPushTokenHelper();

    expect(log).toHaveBeenCalledWith('FCM token:', 'fcm-token');
  });
});
