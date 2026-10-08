import type { ReactNode } from 'react';
import { act, render, screen } from '@testing-library/react-native';

import { COLORS, ConfigProvider } from '../../../shared/config';
import type { ResolvedConfig } from '../../../shared/config';
import { TabsView } from './tabs-view';

const config: ResolvedConfig = {
  startUrl: 'https://example.com/',
  theme: { primary: '#1E6FFF' },
  tabs: [
    { title: 'Home', icon: 'home', url: 'https://example.com/' },
    { title: 'Catalog', icon: 'grid', url: 'https://example.com/catalog/' },
    { title: 'Blog', icon: 'info', url: 'https://blog.other.com/' },
  ],
  startTabIndex: 0,
};

const wrapper = ({ children }: { children: ReactNode }) => (
  <ConfigProvider value={config}>{children}</ConfigProvider>
);

const renderTabsView = async () => {
  const renderScene = jest.fn(() => null);
  await render(<TabsView renderScene={renderScene} />, { wrapper });

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
        { key: 'tab-2', title: 'Blog', isExternal: true },
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
    const [home, , blog] = tabView.props.navigationState.routes;

    expect(tabView.props.getPreventsDefault({ route: home })).toBe(false);
    expect(tabView.props.getPreventsDefault({ route: blog })).toBe(true);
  });

  it('renders the page of the active tab', async () => {
    const { renderScene } = await renderTabsView();

    expect(renderScene).toHaveBeenLastCalledWith({
      ref: expect.any(Function),
      uri: 'https://example.com/',
      onNavigationStateChange: expect.any(Function),
    });
  });

  it('renders the page of the tab the user switched to', async () => {
    const { renderScene, tabView } = await renderTabsView();

    await act(() => tabView.props.onIndexChange(1));

    expect(renderScene).toHaveBeenLastCalledWith(
      expect.objectContaining({ uri: 'https://example.com/catalog/' }),
    );
  });
});
