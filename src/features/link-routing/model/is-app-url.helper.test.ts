import { isAppUrlHelper } from './is-app-url.helper';

const TAB_URL = 'https://app.example.com/orders';

describe('isAppUrlHelper', () => {
  it('accepts any page on the origin of the tab URL', () => {
    expect(
      isAppUrlHelper(
        'https://app.example.com/catalog/12?tab=reviews#top',
        TAB_URL,
      ),
    ).toBe(true);
  });

  it('accepts the bare origin', () => {
    expect(isAppUrlHelper('https://app.example.com', TAB_URL)).toBe(true);
  });

  it('ignores the case of the host', () => {
    expect(isAppUrlHelper('https://APP.example.com/billing', TAB_URL)).toBe(
      true,
    );
  });

  it('rejects another scheme or port of the same host', () => {
    expect(isAppUrlHelper('http://app.example.com/', TAB_URL)).toBe(false);
    expect(isAppUrlHelper('https://app.example.com:8443/', TAB_URL)).toBe(
      false,
    );
  });

  it('rejects other sites, subdomains included', () => {
    expect(isAppUrlHelper('https://example.com/', TAB_URL)).toBe(false);
    expect(isAppUrlHelper('https://blog.app.example.com/', TAB_URL)).toBe(
      false,
    );
  });

  it('rejects hosts that only start with the tab host', () => {
    expect(isAppUrlHelper('https://app.example.com.evil.com/', TAB_URL)).toBe(
      false,
    );
    expect(isAppUrlHelper('https://app.example.com@evil.com/', TAB_URL)).toBe(
      false,
    );
  });

  it('rejects non-web URLs', () => {
    expect(isAppUrlHelper('tel:+123456789', TAB_URL)).toBe(false);
    expect(isAppUrlHelper('mailto:info@example.com', TAB_URL)).toBe(false);
  });

  it('accepts nothing for a tab without a web URL', () => {
    expect(
      isAppUrlHelper('mailto:info@example.com', 'mailto:info@example.com'),
    ).toBe(false);
  });
});
