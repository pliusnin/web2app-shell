import { Platform } from 'react-native';

import type { WebViewError } from '../../../../shared/lib';
import { classifyLoadErrorHelper } from './classify-load-error.helper';

const createError = (code: number, domain?: string): WebViewError => ({
  code,
  domain,
  description: '',
  url: 'https://example.com/',
  title: '',
  loading: false,
  canGoBack: false,
  canGoForward: false,
  lockIdentifier: 0,
});

describe('classifyLoadErrorHelper', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('on Android', () => {
    beforeEach(() => {
      jest.replaceProperty(Platform, 'OS', 'android');
    });

    it.each([
      ['HOST_LOOKUP', -2],
      ['CONNECT', -6],
      ['IO', -7],
      ['TIMEOUT', -8],
    ])('treats %s (%i) as a network error', (_name, code) => {
      expect(classifyLoadErrorHelper(createError(code))).toBe('network');
    });

    it('ignores the unknown URL scheme error of app links', () => {
      expect(classifyLoadErrorHelper(createError(-10))).toBe('ignored');
    });

    it('leaves other errors to the WebView', () => {
      expect(classifyLoadErrorHelper(createError(-1))).toBe('other');
    });
  });

  describe('on iOS', () => {
    beforeEach(() => {
      jest.replaceProperty(Platform, 'OS', 'ios');
    });

    it.each([
      ['TimedOut', -1001],
      ['CannotFindHost', -1003],
      ['CannotConnectToHost', -1004],
      ['NetworkConnectionLost', -1005],
      ['NotConnectedToInternet', -1009],
      ['InternationalRoamingOff', -1018],
      ['DataNotAllowed', -1020],
    ])('treats NSURLError %s (%i) as a network error', (_name, code) => {
      expect(
        classifyLoadErrorHelper(createError(code, 'NSURLErrorDomain')),
      ).toBe('network');
    });

    it('leaves other NSURLErrors to the WebView', () => {
      expect(
        classifyLoadErrorHelper(createError(-999, 'NSURLErrorDomain')),
      ).toBe('other');
    });

    it('leaves network codes of another domain to the WebView', () => {
      expect(
        classifyLoadErrorHelper(createError(-1009, 'WebKitErrorDomain')),
      ).toBe('other');
    });

    it('does not ignore the Android unknown URL scheme code', () => {
      expect(
        classifyLoadErrorHelper(createError(-10, 'NSURLErrorDomain')),
      ).toBe('other');
    });
  });
});
