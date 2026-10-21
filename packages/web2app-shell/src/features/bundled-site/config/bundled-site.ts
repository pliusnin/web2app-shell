import { Platform } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';

// One directory: we unpack into it and serve from it
export const SITE_DIR = `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/www/app`;
// In Android assets and in the iOS main bundle
export const SITE_ZIP_NAME = 'webapp.zip';
export const SITE_ZIP_PATH =
  Platform.OS === 'android'
    ? ReactNativeBlobUtil.fs.asset(SITE_ZIP_NAME)
    : `${ReactNativeBlobUtil.fs.dirs.MainBundleDir}/${SITE_ZIP_NAME}`;
// Hash of the archive the site was unpacked from; lives inside SITE_DIR
export const SITE_ZIP_HASH_FILE_NAME = '.webapp-zip-md5';
