import { Platform } from 'react-native';
import { getAPNSToken, getMessaging } from '@react-native-firebase/messaging';

const POLL_INTERVAL_MS = 500;
// The token usually comes within a second of the launch. No token by then
// means a Simulator or a missing push entitlement
const TIMEOUT_MS = 10000;

const wait = (ms: number) =>
  new Promise<void>(resolve => setTimeout(resolve, ms));

/**
 * Waits for the APNs token that RNFB requests from iOS on every launch: FCM
 * can't create its own token, and so subscribe to a topic, without it. Rejects
 * when the token doesn't come in time. Resolves at once on Android.
 */
export const waitForApnsTokenHelper = async () => {
  if (Platform.OS !== 'ios') {
    return;
  }
  const deadline = Date.now() + TIMEOUT_MS;
  while (Date.now() < deadline) {
    // Rejects with `unregistered` until iOS answers the APNs registration
    const token = await getAPNSToken(getMessaging()).catch(() => null);
    if (token) {
      return;
    }
    await wait(POLL_INTERVAL_MS);
  }
  throw new Error('No APNs token: pushes are not available on this device');
};
