import { TEXTS } from '../../../../shared/config';
import { getErrorScreenContentHelper } from './get-error-screen-content.helper';

describe('getErrorScreenContentHelper', () => {
  it('describes a missing connection', () => {
    expect(getErrorScreenContentHelper({ type: 'offline' })).toEqual({
      icon: 'wifi-off',
      title: TEXTS.noConnectionTitle,
      message: TEXTS.noConnectionMessage,
    });
  });

  it('describes an HTTP error with its status', () => {
    expect(getErrorScreenContentHelper({ type: 'http', status: 404 })).toEqual({
      icon: 'alert-circle-outline',
      title: TEXTS.httpErrorTitle,
      message: TEXTS.httpErrorMessage(404),
    });
  });
});
