const BASE64_DATA_URL = /^data:([^;,]*)[^,]*;base64,([A-Za-z0-9+/=]+)$/;

/**
 * Reads the file the page hands over as a base64 data: URL: its type and its
 * bytes in base64. Anything else gives undefined: the app downloads nothing
 * by itself.
 */
export const parseFileDataUrlHelper = (url: string) => {
  const match = BASE64_DATA_URL.exec(url);
  return match ? { mimeType: match[1], base64: match[2] } : undefined;
};
