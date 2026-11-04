import { Platform } from 'react-native';
import { getAPNSToken } from '@react-native-firebase/messaging';

import { waitForApnsTokenHelper } from './wait-for-apns-token.helper';

describe('waitForApnsTokenHelper', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
    jest.mocked(getAPNSToken).mockReset();
  });

  describe('on iOS', () => {
    beforeEach(() => {
      jest.replaceProperty(Platform, 'OS', 'ios');
    });

    it('resolves once the APNs token arrives', async () => {
      jest
        .mocked(getAPNSToken)
        .mockRejectedValueOnce(new Error('unregistered'))
        .mockResolvedValueOnce(null)
        .mockResolvedValue('apns-token');

      const result = waitForApnsTokenHelper();
      await jest.advanceTimersByTimeAsync(1000);

      await expect(result).resolves.toBeUndefined();
      expect(getAPNSToken).toHaveBeenCalledTimes(3);
    });

    it('rejects when the token never arrives', async () => {
      jest.mocked(getAPNSToken).mockResolvedValue(null);

      const result = waitForApnsTokenHelper().catch((error: Error) => error);
      await jest.advanceTimersByTimeAsync(10000);

      expect(await result).toHaveProperty(
        'message',
        expect.stringContaining('No APNs token'),
      );
    });
  });

  it('does not wait on Android', async () => {
    jest.replaceProperty(Platform, 'OS', 'android');

    await waitForApnsTokenHelper();

    expect(getAPNSToken).not.toHaveBeenCalled();
  });
});
