import type { FetchRequest, FetchResponse } from '../../../../shared/bridge';
import { base64ToBytesHelper } from './base64-to-bytes.helper';
import { blobToBase64Helper } from './blob-to-base64.helper';

// React Native отправляет байты только с типом: без него Android их отклоняет,
// а iOS шлёт как URL-encoded форму. Байты без типа в HTTP — octet-stream
const withBodyType = ({ headers, body }: FetchRequest['options']) =>
  body && !headers['content-type']
    ? { ...headers, 'content-type': 'application/octet-stream' }
    : headers;

/**
 * Выполняет запрос страницы из приложения, где CORS не действует. Тело
 * и ответ остаются байтами: приложению не нужно знать их формат.
 * Неудачный запрос не бросает исключение, а возвращает ошибку.
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
