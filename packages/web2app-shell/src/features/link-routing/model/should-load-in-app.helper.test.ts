import { Platform } from 'react-native';

import { SITE_ORIGIN } from '../../../shared/config';
import type { ShouldStartLoadRequest } from '../../../shared/lib';
import { shouldLoadInAppHelper } from './should-load-in-app.helper';

const APP_URL = `${SITE_ORIGIN}/catalog`;
const OTHER_URL = 'https://other.com/';

const createRequest = (
  url: string,
  isTopFrame: boolean,
): ShouldStartLoadRequest => ({
  url,
  isTopFrame,
  title: '',
  loading: true,
  canGoBack: false,
  canGoForward: false,
  lockIdentifier: 0,
  navigationType: 'click',
});

describe('shouldLoadInAppHelper', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('on iOS', () => {
    beforeEach(() => {
      jest.replaceProperty(Platform, 'OS', 'ios');
    });

    it('loads iframe requests from any host', () => {
      expect(shouldLoadInAppHelper(createRequest(OTHER_URL, false))).toBe(true);
    });

    it('loads top-frame pages of the app host', () => {
      expect(shouldLoadInAppHelper(createRequest(APP_URL, true))).toBe(true);
    });

    it('rejects top-frame pages of another host', () => {
      expect(shouldLoadInAppHelper(createRequest(OTHER_URL, true))).toBe(false);
    });
  });

  describe('on Android', () => {
    beforeEach(() => {
      jest.replaceProperty(Platform, 'OS', 'android');
    });

    it('loads pages of the app host', () => {
      expect(shouldLoadInAppHelper(createRequest(APP_URL, true))).toBe(true);
    });

    it('rejects another host even in an iframe', () => {
      expect(shouldLoadInAppHelper(createRequest(OTHER_URL, false))).toBe(
        false,
      );
    });
  });
});
