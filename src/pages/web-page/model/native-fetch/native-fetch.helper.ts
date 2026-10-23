import type { FetchRequest, FetchResponse } from '../../../../shared/bridge';
import type { FetchInterceptor } from '../../../../shared/fetch-interceptors';
import { base64ToBytesHelper } from './base64-to-bytes.helper';
import { blobToBase64Helper } from './blob-to-base64.helper';
import { runRequestInterceptorsHelper } from './run-request-interceptors.helper';
import { runResponseInterceptorsHelper } from './run-response-interceptors.helper';

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
 * format. The host app's interceptors see and may replace the request and
 * the response. A failed request does not throw but returns an error.
 */
export const nativeFetchHelper = async (
  { url, options }: FetchRequest,
  signal: AbortSignal,
  interceptors: readonly FetchInterceptor[],
): Promise<FetchResponse> => {
  try {
    const request = await runRequestInterceptorsHelper(
      interceptors,
      new Request(url, {
        method: options.method,
        headers: withBodyType(options),
        body: options.body ? base64ToBytesHelper(options.body) : undefined,
        credentials: options.credentials,
        signal,
      }),
    );
    const response = await runResponseInterceptorsHelper(
      interceptors,
      // fetch marks the body of the request it sends as read: a clone keeps it
      // readable for onResponse
      await fetch(request.clone()),
      request,
    );
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
