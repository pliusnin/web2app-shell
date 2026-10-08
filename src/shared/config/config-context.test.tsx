import type { ReactNode } from 'react';
import { renderHook } from '@testing-library/react-native';

import type { ResolvedConfig } from './app-config.types';
import { ConfigProvider, useConfig } from './config-context';

const config: ResolvedConfig = {
  startUrl: 'https://example.com/',
  theme: { primary: '#1E6FFF' },
  tabs: [{ title: 'Home', icon: 'home', url: 'https://example.com/' }],
  startTabIndex: 0,
};

describe('useConfig', () => {
  it('returns the config of the provider', async () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ConfigProvider value={config}>{children}</ConfigProvider>
    );

    const { result } = await renderHook(useConfig, { wrapper });

    expect(result.current).toBe(config);
  });

  it('throws outside the provider', async () => {
    await expect(renderHook(useConfig)).rejects.toThrow(
      'useConfig must be used inside ConfigProvider',
    );
  });
});
