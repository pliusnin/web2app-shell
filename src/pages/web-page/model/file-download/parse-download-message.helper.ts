import { isAppUrlHelper } from '../../../../features/link-routing';
import type { DownloadedFile } from '../../../../shared/bridge';

type DownloadMessage = { cmd: 'DOWNLOAD_FILE'; args: DownloadedFile };

/**
 * Reads the file a page asks the app to save from a WebView message. Messages
 * of other origins and anything else the page posts give undefined.
 */
export const parseDownloadMessageHelper = (
  { url, data }: { url: string; data: string },
  pageUri: string,
): DownloadedFile | undefined => {
  // Any frame can post: only pages of the tab's site may save files
  if (!isAppUrlHelper(url, pageUri)) {
    return undefined;
  }
  try {
    const message: Partial<DownloadMessage> = JSON.parse(data);
    const fileName = message?.args?.fileName;
    const fileUrl = message?.args?.url;
    return message?.cmd === 'DOWNLOAD_FILE' &&
      typeof fileName === 'string' &&
      typeof fileUrl === 'string'
      ? { fileName, url: fileUrl }
      : undefined;
  } catch {
    return undefined;
  }
};
