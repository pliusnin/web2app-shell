import { act, renderHook } from '@testing-library/react-native';
import type { WebViewNavigation } from 'react-native-webview';

import { useTabWebViews } from './use-tab-web-views';

const ROOT_URI = 'https://example.com/catalog/';

const createWebView = () => ({
  goBack: jest.fn(),
  injectJavaScript: jest.fn(),
  reload: jest.fn(),
  stopLoading: jest.fn(),
});

const createNavState = (canGoBack: boolean): WebViewNavigation => ({
  url: 'https://example.com/catalog/',
  title: '',
  loading: false,
  canGoBack,
  canGoForward: false,
  lockIdentifier: 0,
  navigationType: 'click',
});

const renderTabWebViews = async () => {
  const { result, rerender } = await renderHook(useTabWebViews);
  const webViews = { home: createWebView(), catalog: createWebView() };
  result.current.ref('home')(webViews.home);
  result.current.ref('catalog')(webViews.catalog);

  return { result, rerender, webViews };
};

describe('useTabWebViews', () => {
  it('leaves the back press to the system when the tab has no history', async () => {
    const { result, webViews } = await renderTabWebViews();

    expect(result.current.tryGoBack('home')).toBe(false);
    expect(webViews.home.goBack).not.toHaveBeenCalled();
  });

  it('goes back in the tab WebView when it has history', async () => {
    const { result, webViews } = await renderTabWebViews();

    result.current.onNavigationStateChange('home')(createNavState(true));

    expect(result.current.tryGoBack('home')).toBe(true);
    expect(webViews.home.goBack).toHaveBeenCalledTimes(1);
  });

  it('tracks the history of every tab separately', async () => {
    const { result, webViews } = await renderTabWebViews();

    result.current.onNavigationStateChange('home')(createNavState(true));

    expect(result.current.tryGoBack('catalog')).toBe(false);
    expect(webViews.catalog.goBack).not.toHaveBeenCalled();
  });

  it('forgets the history once the tab is back at its first page', async () => {
    const { result } = await renderTabWebViews();

    result.current.onNavigationStateChange('home')(createNavState(true));
    result.current.onNavigationStateChange('home')(createNavState(false));

    expect(result.current.tryGoBack('home')).toBe(false);
  });

  it('gives a tab its own URI until it is reset', async () => {
    const { result } = await renderTabWebViews();

    expect(result.current.source('catalog', ROOT_URI)).toEqual({
      uri: ROOT_URI,
      version: 0,
    });
  });

  it('loads the passed URI in a new WebView of only that tab', async () => {
    const { result, webViews } = await renderTabWebViews();

    await act(() => result.current.resetToRoot('catalog', ROOT_URI));

    expect(result.current.source('catalog', ROOT_URI)).toEqual({
      uri: ROOT_URI,
      version: 1,
    });
    expect(result.current.source('home', 'https://example.com/')).toEqual({
      uri: 'https://example.com/',
      version: 0,
    });
    expect(webViews.catalog.injectJavaScript).not.toHaveBeenCalled();
  });

  it('gives every reset of a tab a new version', async () => {
    const { result } = await renderTabWebViews();

    await act(() => result.current.resetToRoot('catalog', ROOT_URI));
    await act(() => result.current.resetToRoot('catalog', ROOT_URI));

    expect(result.current.source('catalog', ROOT_URI).version).toBe(2);
  });

  it('forgets the tab history on reset', async () => {
    const { result } = await renderTabWebViews();

    result.current.onNavigationStateChange('catalog')(createNavState(true));
    await act(() => result.current.resetToRoot('catalog', ROOT_URI));

    expect(result.current.tryGoBack('catalog')).toBe(false);
  });

  it('keeps the same controls between renders', async () => {
    const { result, rerender } = await renderTabWebViews();
    const controls = result.current;

    await rerender(undefined);

    expect(result.current).toBe(controls);
  });
});
