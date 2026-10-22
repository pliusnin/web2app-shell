import ReactNativeBlobUtil from 'react-native-blob-util';
import { open } from 'react-native-file-viewer-turbo';

import { TEXTS } from '../../../../shared/config';
import type { DownloadedFile } from '../../../../shared/bridge';
import { getDownloadFileNameHelper } from './get-download-file-name.helper';
import { readFileUrlHelper } from './read-file-url.helper';

// The viewer's FileProvider on Android serves files from the cache directory
const DOWNLOADS_DIR = `${ReactNativeBlobUtil.fs.dirs.CacheDir}/downloads`;

/**
 * Saves the file the site downloads and opens it in the system viewer:
 * Quick Look on iOS, the app registered for the file type on Android.
 */
export const openDownloadedFileHelper = async ({
  fileName,
  url,
}: DownloadedFile) => {
  const { mimeType, base64 } = await readFileUrlHelper(url);

  if (!(await ReactNativeBlobUtil.fs.isDir(DOWNLOADS_DIR))) {
    await ReactNativeBlobUtil.fs.mkdir(DOWNLOADS_DIR);
  }
  const path = `${DOWNLOADS_DIR}/${getDownloadFileNameHelper(fileName, mimeType)}`;

  await ReactNativeBlobUtil.fs.writeFile(path, base64, 'base64');
  await open(path, {
    displayName: fileName,
    doneButtonTitle: TEXTS.fileViewerDone,
  });
};
