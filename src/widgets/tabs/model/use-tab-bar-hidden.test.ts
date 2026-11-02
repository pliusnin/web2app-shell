import CookieManager from '@preeternal/react-native-cookie-manager';
import type { Cookie } from '@preeternal/react-native-cookie-manager';
import { act, renderHook } from '@testing-library/react-native';
import type { WebViewNavigation } from 'react-native-webview';

import type { AuthToken } from './auth-token.types';
import { useTabBarHidden } from './use-tab-bar-hidden';

const TAB_URI = 'https://app.example.com/orders';
const SIGNED_IN = [{ name: 'sid', value: 'abc' }];
const COOKIE: AuthToken = { storage: 'cookie', key: 'sid' };
const LOCAL_STORAGE: AuthToken = { storage: 'localStorage', key: 'token' };

const createNavState = (url: string, loading = false): WebViewNavigation => ({
  url,
  title: '',
  loading,
  canGoBack: false,
  canGoForward: false,
  lockIdentifier: 0,
  navigationType: 'click',
});

const mockCookies = (cookies: ReadonlyArray<Cookie>) =>
  jest.mocked(CookieManager.getAsArray).mockResolvedValue(cookies);

const TAB_KEY = 'tab-0';

const renderTabBarHidden = (authToken?: AuthToken, uri = TAB_URI) =>
  renderHook(
    (props: { authToken?: AuthToken; route: { key: string; uri: string } }) =>
      useTabBarHidden(props.authToken, props.route),
    { initialProps: { authToken, route: { key: TAB_KEY, uri } } },
  );

describe('useTabBarHidden', () => {
  beforeEach(() => {
    jest.mocked(CookieManager.getAsArray).mockClear();
    mockCookies([]);
  });

  it('always shows the tab bar without an auth token', async () => {
    const { result } = await renderTabBarHidden();

    await act(() =>
      result.current.onNavigationStateChange(TAB_KEY)(createNavState(TAB_URI)),
    );

    expect(result.current.isHidden).toBe(false);
    expect(CookieManager.getAsArray).not.toHaveBeenCalled();
  });

  it('hides the tab bar while the active tab has no auth cookie', async () => {
    const { result } = await renderTabBarHidden(COOKIE);

    expect(CookieManager.getAsArray).toHaveBeenCalledWith(
      TAB_URI,
      expect.anything(),
    );
    expect(result.current.isHidden).toBe(true);
  });

  it('shows the tab bar when the active tab has the auth cookie', async () => {
    mockCookies(SIGNED_IN);

    const { result } = await renderTabBarHidden(COOKIE);

    expect(result.current.isHidden).toBe(false);
  });

  it('shows the tab bar once a page loads after sign-in', async () => {
    const { result } = await renderTabBarHidden(COOKIE);
    mockCookies(SIGNED_IN);

    await act(() =>
      result.current.onNavigationStateChange(TAB_KEY)(
        createNavState('https://app.example.com/dashboard'),
      ),
    );

    expect(CookieManager.getAsArray).toHaveBeenLastCalledWith(
      'https://app.example.com/dashboard',
      expect.anything(),
    );
    expect(result.current.isHidden).toBe(false);
  });

  it('hides the tab bar once a page loads after sign-out', async () => {
    mockCookies(SIGNED_IN);
    const { result } = await renderTabBarHidden(COOKIE);
    mockCookies([]);

    await act(() =>
      result.current.onNavigationStateChange(TAB_KEY)(
        createNavState('https://app.example.com/login'),
      ),
    );

    expect(result.current.isHidden).toBe(true);
  });

  it('waits for the page to finish loading before checking', async () => {
    const { result } = await renderTabBarHidden(COOKIE);
    jest.mocked(CookieManager.getAsArray).mockClear();

    await act(() =>
      result.current.onNavigationStateChange(TAB_KEY)(
        createNavState(TAB_URI, true),
      ),
    );

    expect(CookieManager.getAsArray).not.toHaveBeenCalled();
  });

  it('skips non-web URLs', async () => {
    await renderTabBarHidden(COOKIE, 'mailto:help@example.com');

    expect(CookieManager.getAsArray).not.toHaveBeenCalled();
  });

  it('checks the tab the user switched to', async () => {
    const { rerender } = await renderTabBarHidden(COOKIE);

    await rerender({
      authToken: COOKIE,
      route: { key: 'tab-1', uri: 'https://shop.example.com/' },
    });

    expect(CookieManager.getAsArray).toHaveBeenLastCalledWith(
      'https://shop.example.com/',
      expect.anything(),
    );
  });

  it('keeps the result of the latest page when checks resolve out of order', async () => {
    const pending: Array<(cookies: ReadonlyArray<Cookie>) => void> = [];
    const { result } = await renderTabBarHidden(COOKIE);
    jest
      .mocked(CookieManager.getAsArray)
      .mockImplementation(() => new Promise(resolve => pending.push(resolve)));

    await act(() => {
      result.current.onNavigationStateChange(TAB_KEY)(
        createNavState('https://app.example.com/dashboard'),
      );
      result.current.onNavigationStateChange(TAB_KEY)(
        createNavState('https://app.example.com/login'),
      );
    });
    const [dashboard, login] = pending;
    await act(async () => {
      login([]);
      dashboard(SIGNED_IN);
    });

    expect(result.current.isHidden).toBe(true);
  });

  describe('with a localStorage token', () => {
    it('asks the page to watch the key and reads no cookies', async () => {
      const { result } = await renderTabBarHidden(LOCAL_STORAGE);

      await act(() =>
        result.current.onNavigationStateChange(TAB_KEY)(
          createNavState(TAB_URI),
        ),
      );

      expect(result.current.localStorageKey).toBe('token');
      expect(CookieManager.getAsArray).not.toHaveBeenCalled();
    });

    it('hides the tab bar until the page reports the key', async () => {
      const { result } = await renderTabBarHidden(LOCAL_STORAGE);

      expect(result.current.isHidden).toBe(true);
    });

    it('follows the reports of the page', async () => {
      const { result } = await renderTabBarHidden(LOCAL_STORAGE);

      await act(() => result.current.onLocalStorageKeyChange(TAB_KEY)(true));
      expect(result.current.isHidden).toBe(false);

      await act(() => result.current.onLocalStorageKeyChange(TAB_KEY)(false));
      expect(result.current.isHidden).toBe(true);
    });
  });

  it('ignores pages of a tab that is no longer active', async () => {
    const { result, rerender } = await renderTabBarHidden(LOCAL_STORAGE);
    const reportFromFirstTab = result.current.onLocalStorageKeyChange(TAB_KEY);

    await rerender({
      authToken: LOCAL_STORAGE,
      route: { key: 'tab-1', uri: 'https://app.example.com/catalog' },
    });
    await act(() => reportFromFirstTab(true));

    expect(result.current.isHidden).toBe(true);
  });

  it('watches no localStorage key for a cookie token', async () => {
    const { result } = await renderTabBarHidden(COOKIE);

    expect(result.current.localStorageKey).toBeUndefined();
  });
});
