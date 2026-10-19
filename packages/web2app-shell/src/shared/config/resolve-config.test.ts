import type { AppConfig } from './app-config.types';
import { resolveConfig } from './resolve-config';

const config: AppConfig = {
  userAgentSuffix: 'shell/1.0',
  theme: { primary: '#1E6FFF' },
  tabs: [
    { title: 'Catalog', icon: 'view-grid', url: '/catalog' },
    { title: 'Home', icon: 'home', url: '/' },
    { title: 'About', icon: 'information', url: '/about/' },
  ],
};

describe('resolveConfig', () => {
  it('opens the tab whose URL equals startUrl', () => {
    expect(resolveConfig({ ...config, startUrl: '/' }).startTabIndex).toBe(1);
  });

  it.each([
    ['with', 'without', '/catalog/', 0],
    ['without', 'with', '/about', 2],
  ])(
    'matches startUrl %s a trailing slash to a tab URL %s one',
    (_startSlash, _tabSlash, startUrl, startTabIndex) => {
      expect(resolveConfig({ ...config, startUrl }).startTabIndex).toBe(
        startTabIndex,
      );
    },
  );

  it('opens the first tab when no tab matches startUrl', () => {
    expect(
      resolveConfig({ ...config, startUrl: '/landing' }).startTabIndex,
    ).toBe(0);
  });

  it('opens the first tab when startUrl is not set', () => {
    expect(resolveConfig(config).startTabIndex).toBe(0);
  });

  it('keeps the tabs, the theme and the user agent suffix', () => {
    expect(resolveConfig(config)).toMatchObject({
      tabs: config.tabs,
      theme: config.theme,
      userAgentSuffix: config.userAgentSuffix,
    });
  });
});
