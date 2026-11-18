import type { MessageHandler } from '../../../../shared/lib';
import { openDownloadedFileHelper } from './open-downloaded-file.helper';
import { parseDownloadMessageHelper } from './parse-download-message.helper';
import { showFileErrorToastHelper } from './show-file-error-toast.helper';

/**
 * Returns the WebView onMessage handler that saves and opens a file the page
 * sends with DOWNLOAD_FILE: a WebView can't download a file the site builds
 * in the browser (blob:). A failure shows a toast.
 */
export const useFileDownload = (pageUri: string): MessageHandler => {
  return ({ nativeEvent }) => {
    const file = parseDownloadMessageHelper(nativeEvent, pageUri);
    if (!file) {
      return;
    }
    openDownloadedFileHelper(file).catch(error => {
      console.warn(error);
      showFileErrorToastHelper();
    });
  };
};
