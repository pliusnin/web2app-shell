import { getHttpErrorActionHelper } from './get-http-error-action.helper';

describe('getHttpErrorActionHelper', () => {
  it.each([404, 499])(
    'shows the error screen for %i whether a page was shown or not',
    status => {
      expect(getHttpErrorActionHelper(status, false)).toBe('showErrorScreen');
      expect(getHttpErrorActionHelper(status, true)).toBe('showErrorScreen');
    },
  );

  it.each([500, 503])(
    'aborts to the error screen on %i before any page was shown',
    status => {
      expect(getHttpErrorActionHelper(status, false)).toBe(
        'abortToErrorScreen',
      );
    },
  );

  it.each([500, 503])(
    'aborts to the current page on %i after a page was shown',
    status => {
      expect(getHttpErrorActionHelper(status, true)).toBe('abortToCurrentPage');
    },
  );
});
