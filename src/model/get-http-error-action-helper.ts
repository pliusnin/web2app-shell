import type { HttpErrorAction } from './types';

export const getHttpErrorActionHelper = (
  status: number,
  hasShownPage: boolean,
): HttpErrorAction => {
  if (status < 500) {
    return 'showErrorScreen';
  }
  return hasShownPage ? 'abortToCurrentPage' : 'abortToErrorScreen';
};
