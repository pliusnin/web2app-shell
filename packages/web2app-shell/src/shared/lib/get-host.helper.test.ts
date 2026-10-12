import { getHostHelper } from './get-host.helper';

describe('getHostHelper', () => {
  it.each([
    ['https://example.com/portfolio/', 'https'],
    ['http://example.com/portfolio/', 'http'],
    ['HTTPS://example.com/portfolio/', 'an uppercase'],
  ])('extracts the host from %s with %s scheme', url => {
    expect(getHostHelper(url)).toBe('example.com');
  });

  it('lowercases the host', () => {
    expect(getHostHelper('https://Example.COM/')).toBe('example.com');
  });

  it.each([
    'https://example.com:8080/',
    'https://example.com?page=2',
    'https://example.com#about',
    'https://example.com',
  ])('finds where the host ends in %s', url => {
    expect(getHostHelper(url)).toBe('example.com');
  });

  it('keeps subdomains', () => {
    expect(getHostHelper('https://www.example.com/')).toBe('www.example.com');
  });

  it.each([
    'tel:+123456789',
    'mailto:info@example.com',
    'ftp://example.com/',
    '/catalog/',
    '',
  ])('gives no host for the non-web URL "%s"', url => {
    expect(getHostHelper(url)).toBeUndefined();
  });
});
