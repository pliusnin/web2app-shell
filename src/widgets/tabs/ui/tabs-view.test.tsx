import type { ReactNode } from 'react';
import CookieManager from '@preeternal/react-native-cookie-manager';
import { act, render, screen } from '@testing-library/react-native';
import type { WebViewNavigation } from 'react-native-webview';

import { COLORS, ConfigProvider, SITE_ORIGIN } from '../../../shared/config';
import type { ResolvedConfig } from '../../../shared/config';
import type { AuthToken } from '../model/auth-token.types';
import type { TabScene } from '../model/tabs.types';
import { TabsView } from './tabs-view';

const config: ResolvedConfig = {
  theme: { primary: '#1E6FFF' },
  tabs: [
    { title: 'Home', icon: 'home', url: '/' },
    { title: 'Catalog', icon: 'view-grid', url: '/catalog' },
    { title: 'Support', icon: 'email', url: 'mailto:help@example.com' },
  ],
  startTabIndex: 0,
};

const signedInPage: WebViewNavigation = {
  url: `${SITE_ORIGIN}/dashboard`,
  title: '',
  loading: false,
  canGoBack: true,
  canGoForward: false,
  lockIdentifier: 0,
  navigationType: 'click',
};

const LOCAL_STORAGE: AuthToken = { storage: 'localStorage', key: 'token' };

const wrapper = ({ children }: { children: ReactNode }) => (
  <ConfigProvider value={config}>{children}</ConfigProvider>
);

const renderTabsView = async (authToken?: AuthToken) => {
  const renderScene = jest.fn<ReactNode, [TabScene]>(() => null);
  await render(<TabsView renderScene={renderScene} authToken={authToken} />, {
    wrapper,
  });

  return { renderScene, tabView: screen.getByTestId('tab-view') };
};

describe('TabsView', () => {
  it('builds the tab bar from the config tabs', async () => {
    const { tabView } = await renderTabsView();

    expect(tabView.props.navigationState).toMatchObject({
      index: 0,
      routes: [
        { key: 'tab-0', title: 'Home', isExternal: false },
        { key: 'tab-1', title: 'Catalog', isExternal: false },
        { key: 'tab-2', title: 'Support', isExternal: true },
      ],
    });
  });

  it('paints the tab bar in the theme and scheme colors', async () => {
    const { tabView } = await renderTabsView();

    expect(tabView).toHaveProp('tabBarActiveTintColor', config.theme.primary);
    expect(tabView).toHaveProp('tabBarStyle', {
      backgroundColor: COLORS.white,
    });
  });

  it('stops the native tab switch for external tabs only', async () => {
    const { tabView } = await renderTabsView();
    const [home, , support] = tabView.props.navigationState.routes;

    expect(tabView.props.getPreventsDefault({ route: home })).toBe(false);
    expect(tabView.props.getPreventsDefault({ route: support })).toBe(true);
  });

  it('renders the page of the active tab', async () => {
    const { renderScene } = await renderTabsView();

    expect(renderScene).toHaveBeenLastCalledWith({
      ref: expect.any(Function),
      uri: `${SITE_ORIGIN}/`,
      onNavigationStateChange: expect.any(Function),
      localStorageKey: undefined,
      onLocalStorageKeyChange: expect.any(Function),
    });
  });

  it('renders the page of the tab the user switched to', async () => {
    const { renderScene, tabView } = await renderTabsView();

    await act(() => tabView.props.onIndexChange(1));

    expect(renderScene).toHaveBeenLastCalledWith(
      expect.objectContaining({ uri: `${SITE_ORIGIN}/catalog` }),
    );
  });

  it('shows the tab bar without an auth token', async () => {
    const { tabView } = await renderTabsView();

    expect(tabView).toHaveProp('tabBarHidden', false);
  });

  it('hides the tab bar while the user is signed out', async () => {
    jest.mocked(CookieManager.getAsArray).mockResolvedValue([]);

    const { tabView } = await renderTabsView({ storage: 'cookie', key: 'sid' });

    expect(tabView).toHaveProp('tabBarHidden', true);
  });

  it('shows the tab bar after a page loads signed in', async () => {
    jest.mocked(CookieManager.getAsArray).mockResolvedValue([]);
    const { renderScene } = await renderTabsView({
      storage: 'cookie',
      key: 'sid',
    });
    jest
      .mocked(CookieManager.getAsArray)
      .mockResolvedValue([{ name: 'sid', value: 'abc' }]);

    const [scene] = renderScene.mock.lastCall!;
    await act(() => scene.onNavigationStateChange(signedInPage));

    expect(screen.getByTestId('tab-view')).toHaveProp('tabBarHidden', false);
  });

  it('shows the tab bar once the page reports the localStorage token', async () => {
    const { renderScene } = await renderTabsView(LOCAL_STORAGE);
    const [scene] = renderScene.mock.lastCall!;

    expect(scene.localStorageKey).toBe('token');
    await act(() => scene.onLocalStorageKeyChange(true));

    expect(screen.getByTestId('tab-view')).toHaveProp('tabBarHidden', false);
  });

  it('ignores reports from a tab that is no longer active', async () => {
    const { renderScene, tabView } = await renderTabsView(LOCAL_STORAGE);
    const [homeScene] = renderScene.mock.lastCall!;

    await act(() => tabView.props.onIndexChange(1));
    await act(() => homeScene.onLocalStorageKeyChange(true));

    expect(screen.getByTestId('tab-view')).toHaveProp('tabBarHidden', true);
  });
});
