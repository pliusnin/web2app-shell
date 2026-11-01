import { getOriginHelper } from './get-origin.helper';

describe('getOriginHelper', () => {
  it('extracts the origin of an http(s) URL', () => {
    expect(getOriginHelper('https://example.com/portfolio/?page=2#top')).toBe(
      'https://example.com',
    );
    expect(getOriginHelper('http://example.com')).toBe('http://example.com');
  });

  it('keeps the port', () => {
    expect(getOriginHelper('http://127.0.0.1:3035/catalog')).toBe(
      'http://127.0.0.1:3035',
    );
  });

  it('lowercases the scheme and the host', () => {
    expect(getOriginHelper('HTTPS://Example.COM/Path')).toBe(
      'https://example.com',
    );
  });

  it.each([
    'tel:+123456789',
    'mailto:info@example.com',
    'ftp://example.com/',
    '/catalog/',
    '',
  ])('gives no origin for the non-web URL "%s"', url => {
    expect(getOriginHelper(url)).toBeUndefined();
  });
});
