import { Platform } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { WebAppManager } from 'web-in-mobile-tools';

import {
  SITE_DIR,
  SITE_ZIP_HASH_FILE_NAME,
  SITE_ZIP_NAME,
  SITE_ZIP_PATH,
} from '../config/bundled-site';

const webApp = new WebAppManager({
  appDir: SITE_DIR,
  bundledZipName: SITE_ZIP_NAME,
  platform: Platform.OS === 'ios' ? 'ios' : 'android',
});

/**
 * Unpacks webapp.zip from the app when the site is missing or the app ships
 * another archive. install() only checks for index.html, so the site is
 * unpacked again when the archive hash differs from the stored one.
 */
export const installBundledSiteHelper = async () => {
  const { fs } = ReactNativeBlobUtil;
  const hashPath = `${SITE_DIR}/${SITE_ZIP_HASH_FILE_NAME}`;
  const zipHash = await fs.hash(SITE_ZIP_PATH, 'md5');
  const installedHash = (await fs.exists(hashPath))
    ? await fs.readFile(hashPath, 'utf8')
    : null;

  if (installedHash !== zipHash && (await fs.exists(SITE_DIR))) {
    await fs.unlink(SITE_DIR);
  }
  await webApp.install();
  await fs.writeFile(hashPath, zipHash, 'utf8');
};
