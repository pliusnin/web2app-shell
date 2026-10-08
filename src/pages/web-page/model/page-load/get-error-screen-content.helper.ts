import { TEXTS } from '../../../../shared/config';
import type { ErrorScreenContent } from './error-screen-content.types';
import type { PageError } from './page-load-error.types';

/**
 * Picks the icon, title and message of the error screen for a page error:
 * no connection or an HTTP error with its status.
 */
export const getErrorScreenContentHelper = (
  error: PageError,
): ErrorScreenContent => {
  switch (error.type) {
    case 'offline':
      return {
        icon: 'wifi-off',
        title: TEXTS.noConnectionTitle,
        message: TEXTS.noConnectionMessage,
      };
    case 'http':
      return {
        icon: 'alert-circle-outline',
        title: TEXTS.httpErrorTitle,
        message: TEXTS.httpErrorMessage(error.status),
      };
  }
};
