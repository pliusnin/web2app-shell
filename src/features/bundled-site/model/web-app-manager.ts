import { Platform } from 'react-native';
import { WebAppManager } from 'web-in-mobile-tools';

import {
  SITE_DIR,
  SITE_UPDATE_MIN_INTERVAL_MS,
  SITE_ZIP_NAME,
} from '../config/bundled-site';

// One manager over the served directory, shared by install and update:
// install() unpacks the bundled archive, updateIfNewer() refreshes it from a
// URL. A single instance keeps the throttle and the in-flight download guard
// shared across callers.
export const webApp = new WebAppManager({
  appDir: SITE_DIR,
  bundledZipName: SITE_ZIP_NAME,
  platform: Platform.OS === 'ios' ? 'ios' : 'android',
  minCheckIntervalMs: SITE_UPDATE_MIN_INTERVAL_MS,
  logger: console,
});
