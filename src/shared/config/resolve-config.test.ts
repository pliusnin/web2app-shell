import type { AppConfig } from './app-config.types';
import { resolveConfig } from './resolve-config';

const config: AppConfig = {
  userAgentSuffix: 'shell/1.0',
  theme: { primary: '#1E6FFF' },
  tabs: [
    { title: 'Home', icon: 'home', url: 'https://example.com/' },
    { title: 'Catalog', icon: 'grid', url: 'https://example.com/catalog/' },
    { title: 'About', icon: 'info', url: 'https://example.com/about' },
  ],
};

describe('resolveConfig', () => {
  it('opens the tab whose URL equals startUrl', () => {
    const resolved = resolveConfig({
      ...config,
      startUrl: 'https://example.com/catalog/',
    });

    expect(resolved).toMatchObject({
      startTabIndex: 1,
      startUrl: 'https://example.com/catalog/',
    });
  });

  it.each([
    ['without', 'with', 'https://example.com/catalog', 1],
    ['with', 'without', 'https://example.com/about/', 2],
  ])(
    'matches startUrl %s a trailing slash to a tab URL %s one',
    (_startSlash, _tabSlash, startUrl, startTabIndex) => {
      expect(resolveConfig({ ...config, startUrl }).startTabIndex).toBe(
        startTabIndex,
      );
    },
  );

  it('opens the first tab and keeps startUrl when no tab matches it', () => {
    const resolved = resolveConfig({
      ...config,
      startUrl: 'https://example.com/landing/',
    });

    expect(resolved).toMatchObject({
      startTabIndex: 0,
      startUrl: 'https://example.com/landing/',
    });
  });

  it('takes startUrl from the first tab when it is not set', () => {
    expect(resolveConfig(config)).toMatchObject({
      startTabIndex: 0,
      startUrl: 'https://example.com/',
    });
  });

  it('keeps the tabs, the theme and the user agent suffix', () => {
    expect(resolveConfig(config)).toMatchObject({
      tabs: config.tabs,
      theme: config.theme,
      userAgentSuffix: config.userAgentSuffix,
    });
  });
});
