import type { FetchInterceptor } from '../../../../shared/fetch-interceptors';

/**
 * Passes the response through the host app's onResponse interceptors in
 * order. Each gets a clone, so reading the body keeps it for the page. An
 * interceptor that throws is skipped.
 */
export const runResponseInterceptorsHelper = async (
  interceptors: readonly FetchInterceptor[],
  response: Response,
  request: Request,
) => {
  let current = response;
  for (const { onResponse } of interceptors) {
    if (!onResponse) {
      continue;
    }
    try {
      current = (await onResponse(current.clone(), request)) ?? current;
    } catch (error) {
      console.warn('Fetch response interceptor failed', error);
    }
  }
  return current;
};
