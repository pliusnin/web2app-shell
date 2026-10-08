import { isAppUrlHelper } from './is-app-url.helper';

const START_URL = 'https://example.com/';

describe('isAppUrlHelper', () => {
  it('accepts any page of the start URL host', () => {
    expect(
      isAppUrlHelper('https://example.com/catalog/?page=2#top', START_URL),
    ).toBe(true);
  });

  it('compares hosts case-insensitively', () => {
    expect(isAppUrlHelper('https://EXAMPLE.com/about', START_URL)).toBe(true);
  });

  it('ignores the scheme and the port', () => {
    expect(isAppUrlHelper('http://example.com:8080/', START_URL)).toBe(true);
  });

  it('rejects another host', () => {
    expect(isAppUrlHelper('https://other.com/', START_URL)).toBe(false);
  });

  it('rejects subdomains of the start URL host', () => {
    expect(isAppUrlHelper('https://www.example.com/', START_URL)).toBe(false);
  });

  it('rejects non-web URLs', () => {
    expect(isAppUrlHelper('tel:+123456789', START_URL)).toBe(false);
    expect(isAppUrlHelper('mailto:info@example.com', START_URL)).toBe(false);
  });
});
