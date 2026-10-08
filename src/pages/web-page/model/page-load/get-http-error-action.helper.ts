import type { HttpErrorAction } from './page-load-error.types';

/**
 * Decides how to react to an HTTP error status. Below 500 the error screen is
 * shown. On 5xx the load is stopped with a toast: the user stays on the
 * current page if one was already shown, otherwise sees the error screen.
 */
export const getHttpErrorActionHelper = (
  status: number,
  hasShownPage: boolean,
): HttpErrorAction => {
  if (status < 500) {
    return 'showErrorScreen';
  }
  return hasShownPage ? 'abortToCurrentPage' : 'abortToErrorScreen';
};
