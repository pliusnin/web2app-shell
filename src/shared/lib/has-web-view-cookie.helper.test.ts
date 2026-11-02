import CookieManager from '@preeternal/react-native-cookie-manager';

import { WEB_VIEW_COOKIE_STORE } from '../config';
import { hasWebViewCookieHelper } from './has-web-view-cookie.helper';

const URL = 'https://app.example.com/orders';

const mockCookies = (cookies: Array<{ name: string; value: string }>) =>
  jest.mocked(CookieManager.getAsArray).mockResolvedValue(cookies);

describe('hasWebViewCookieHelper', () => {
  it('reads the cookies of the URL from the WebView store', async () => {
    mockCookies([]);

    await hasWebViewCookieHelper(URL, 'sid');

    expect(CookieManager.getAsArray).toHaveBeenCalledWith(
      URL,
      WEB_VIEW_COOKIE_STORE,
    );
  });

  it('finds a cookie with the name and a value', async () => {
    mockCookies([
      { name: 'theme', value: 'dark' },
      { name: 'sid', value: 'abc' },
    ]);

    await expect(hasWebViewCookieHelper(URL, 'sid')).resolves.toBe(true);
  });

  it('misses a cookie with another name', async () => {
    mockCookies([{ name: 'theme', value: 'dark' }]);

    await expect(hasWebViewCookieHelper(URL, 'sid')).resolves.toBe(false);
  });

  it('misses a cookie the site emptied on sign-out', async () => {
    mockCookies([{ name: 'sid', value: '' }]);

    await expect(hasWebViewCookieHelper(URL, 'sid')).resolves.toBe(false);
  });
});
