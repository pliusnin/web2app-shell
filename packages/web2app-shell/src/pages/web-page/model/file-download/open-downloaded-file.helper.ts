import ReactNativeBlobUtil from 'react-native-blob-util';
import { open } from 'react-native-file-viewer-turbo';

import { TEXTS } from '../../../../shared/config';
import type { DownloadedFile } from '../../../../shared/bridge';
import { getDownloadFileNameHelper } from './get-download-file-name.helper';

// FileProvider просмотрщика на Android отдаёт файлы из директории кэша
const DOWNLOADS_DIR = `${ReactNativeBlobUtil.fs.dirs.CacheDir}/downloads`;

/**
 * Сохраняет файл, который скачивает сайт, и открывает его в системном
 * просмотрщике: Quick Look на iOS, приложение для этого типа файла на Android.
 */
export const openDownloadedFileHelper = async ({
  fileName,
  mimeType,
  base64,
}: DownloadedFile) => {
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
