import { SITE_ORIGIN } from '../../../shared/config';
import { isAppUrlHelper } from './is-app-url.helper';

describe('isAppUrlHelper', () => {
  it('accepts any page of the local site', () => {
    expect(isAppUrlHelper(`${SITE_ORIGIN}/catalog/12?tab=reviews#top`)).toBe(
      true,
    );
  });

  it('accepts the bare origin, as Android reports it for messages', () => {
    expect(isAppUrlHelper(SITE_ORIGIN)).toBe(true);
  });

  it('rejects another port of the same host', () => {
    expect(isAppUrlHelper(`${SITE_ORIGIN}0/`)).toBe(false);
  });

  it('rejects other sites', () => {
    expect(isAppUrlHelper('https://example.com/')).toBe(false);
  });

  it('rejects non-web URLs', () => {
    expect(isAppUrlHelper('tel:+123456789')).toBe(false);
    expect(isAppUrlHelper('mailto:info@example.com')).toBe(false);
  });
});
