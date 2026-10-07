import { TEXTS } from '../../../../shared/config';
import type { ErrorScreenContent } from './error-screen-content.types';
import type { PageError } from './page-load-error.types';

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
