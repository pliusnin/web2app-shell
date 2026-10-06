import type { HttpErrorOutcome } from './types';

export const resolveHttpError = (
  status: number,
  hasShownPage: boolean,
): HttpErrorOutcome => {
  if (status < 500) {
    return 'showErrorScreen';
  }
  return hasShownPage ? 'abortToCurrentPage' : 'abortToErrorScreen';
};
