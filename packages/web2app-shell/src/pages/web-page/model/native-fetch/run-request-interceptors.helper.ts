import type { FetchInterceptor } from '../../../../shared/fetch-interceptors';

/**
 * Passes the request through the host app's onRequest interceptors in order.
 * An interceptor that throws is skipped: client code must not break the
 * page's requests.
 */
export const runRequestInterceptorsHelper = async (
  interceptors: readonly FetchInterceptor[],
  request: Request,
) => {
  let current = request;
  for (const { onRequest } of interceptors) {
    try {
      current = (await onRequest?.(current)) ?? current;
    } catch (error) {
      console.warn('Fetch request interceptor failed', error);
    }
  }
  return current;
};
