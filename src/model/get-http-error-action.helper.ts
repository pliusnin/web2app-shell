import type { HttpErrorAction } from './page-load-error.types';

export const getHttpErrorActionHelper = (
  status: number,
  hasShownPage: boolean,
): HttpErrorAction => {
  if (status < 500) {
    return 'showErrorScreen';
  }
  return hasShownPage ? 'abortToCurrentPage' : 'abortToErrorScreen';
};
