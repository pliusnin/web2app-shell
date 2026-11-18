import ReactNativeBlobUtil from 'react-native-blob-util';
import { open } from 'react-native-file-viewer-turbo';

import type { DownloadedFile } from '../../../../shared/bridge';
import { TEXTS } from '../../../../shared/config';
import { getDownloadFileNameHelper } from './get-download-file-name.helper';
import { parseFileDataUrlHelper } from './parse-file-data-url.helper';

// The viewer's FileProvider on Android serves files from the cache directory
const DOWNLOADS_DIR = `${ReactNativeBlobUtil.fs.dirs.CacheDir}/downloads`;

/**
 * Saves the file the page hands over and opens it in the system viewer:
 * Quick Look on iOS, the app registered for the file type on Android. The
 * user saves or shares it from there.
 */
export const openDownloadedFileHelper = async ({
  fileName,
  url,
}: DownloadedFile) => {
  const file = parseFileDataUrlHelper(url);
  if (!file) {
    throw new Error('The downloaded file is not a base64 data: URL');
  }

  if (!(await ReactNativeBlobUtil.fs.isDir(DOWNLOADS_DIR))) {
    await ReactNativeBlobUtil.fs.mkdir(DOWNLOADS_DIR);
  }
  const path = `${DOWNLOADS_DIR}/${getDownloadFileNameHelper(fileName, file.mimeType)}`;

  await ReactNativeBlobUtil.fs.writeFile(path, file.base64, 'base64');
  await open(path, {
    displayName: fileName,
    doneButtonTitle: TEXTS.fileViewerDone,
  });
};
