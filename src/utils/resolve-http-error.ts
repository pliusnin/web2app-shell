import type { HttpErrorResolution } from '../types';

export const resolveHttpError = (
  status: number,
  hasShownPage: boolean,
): HttpErrorResolution => {
  const isServerError = status >= 500;

  return {
    showToast: isServerError,
    stopLoading: isServerError,
    showScreen: !isServerError || !hasShownPage,
  };
};
