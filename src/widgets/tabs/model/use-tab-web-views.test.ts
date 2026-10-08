import { renderHook } from '@testing-library/react-native';
import type { WebViewNavigation } from 'react-native-webview';

import { useTabWebViews } from './use-tab-web-views';

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

  it('sends only the tab WebView to the tab root URL', async () => {
    const { result, webViews } = await renderTabWebViews();

    result.current.resetToRoot('catalog', 'https://example.com/catalog/');

    expect(webViews.catalog.injectJavaScript).toHaveBeenCalledWith(
      'window.location.href = "https://example.com/catalog/"; true;',
    );
    expect(webViews.home.injectJavaScript).not.toHaveBeenCalled();
  });

  it('does nothing for a tab whose WebView is unmounted', async () => {
    const { result, webViews } = await renderTabWebViews();

    result.current.ref('catalog')(null);

    expect(() =>
      result.current.resetToRoot('catalog', 'https://example.com/catalog/'),
    ).not.toThrow();
    expect(webViews.catalog.injectJavaScript).not.toHaveBeenCalled();
  });

  it('keeps the same controls between renders', async () => {
    const { result, rerender } = await renderTabWebViews();
    const controls = result.current;

    await rerender(undefined);

    expect(result.current).toBe(controls);
  });
});
