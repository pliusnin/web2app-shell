import type { FetchRequest, FetchResponse } from '../../../../shared/bridge';
import { base64ToBytesHelper } from './base64-to-bytes.helper';
import { blobToBase64Helper } from './blob-to-base64.helper';

// React Native sends bytes only with a type: without it Android rejects them
// and iOS sends them as a URL-encoded form. Bytes without a type in HTTP are
// octet-stream
const withBodyType = ({ headers, body }: FetchRequest['options']) =>
  body && !headers['content-type']
    ? { ...headers, 'content-type': 'application/octet-stream' }
    : headers;

/**
 * Performs the page's request from the app, where CORS does not apply. The
 * body and the response stay bytes: the app does not need to know their
 * format. A failed request does not throw but returns an error.
 */
export const nativeFetchHelper = async (
  { url, options }: FetchRequest,
  signal: AbortSignal,
): Promise<FetchResponse> => {
  try {
    const response = await fetch(url, {
      method: options.method,
      headers: withBodyType(options),
      body: options.body ? base64ToBytesHelper(options.body) : undefined,
      credentials: options.credentials,
      signal,
    });
    const headers: Record<string, string> = {};
    response.headers.forEach((value, name) => {
      headers[name] = value;
    });

    return {
      resolve: true,
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      headers,
      body: await blobToBase64Helper(await response.blob()),
    };
  } catch (error) {
    return { resolve: false, body: String(error) };
  }
};
