import { TEXTS } from '../config';
import type { ErrorScreenContent, PageError } from './types';

export const getErrorScreenContent = (error: PageError): ErrorScreenContent => {
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
