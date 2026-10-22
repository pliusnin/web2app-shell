import { blobToBase64Helper } from '../native-fetch/blob-to-base64.helper';

const BASE64_DATA_URL = /^data:([^;,]*)[^,]*;base64,(.*)$/;

/**
 * Reads the file behind the URL the site hands over: a base64 data: URL is
 * decoded in place, any other URL is downloaded by the app. Returns the file
 * type and the bytes in base64.
 */
export const readFileUrlHelper = async (url: string) => {
  const dataUrl = BASE64_DATA_URL.exec(url);
  if (dataUrl) {
    return { mimeType: dataUrl[1], base64: dataUrl[2] };
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Download failed with HTTP ${response.status}: ${url}`);
  }

  return {
    mimeType: response.headers.get('content-type') ?? '',
    base64: await blobToBase64Helper(await response.blob()),
  };
};
