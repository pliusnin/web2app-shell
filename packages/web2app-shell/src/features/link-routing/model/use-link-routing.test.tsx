import type { ReactNode } from 'react';
import { Linking } from 'react-native';
import { renderHook } from '@testing-library/react-native';

import { ConfigProvider } from '../../../shared/config';
import type { ResolvedConfig } from '../../../shared/config';
import type { ShouldStartLoadRequest } from '../../../shared/lib';
import { useLinkRouting } from './use-link-routing';

const config: ResolvedConfig = {
  startUrl: 'https://example.com/',
  theme: { primary: '#1E6FFF' },
  tabs: [{ title: 'Home', icon: 'home', url: 'https://example.com/' }],
  startTabIndex: 0,
};

const createRequest = (url: string): ShouldStartLoadRequest => ({
  url,
  isTopFrame: true,
  title: '',
  loading: true,
  canGoBack: false,
  canGoForward: false,
  lockIdentifier: 0,
  navigationType: 'click',
});

const wrapper = ({ children }: { children: ReactNode }) => (
  <ConfigProvider value={config}>{children}</ConfigProvider>
);

// RN types say Promise<void>, but the native module resolves whether the URL opened
const openURL = Linking.openURL as unknown as jest.Mock<
  Promise<boolean>,
  [string]
>;

describe('useLinkRouting', () => {
  beforeEach(() => {
    openURL.mockResolvedValue(true);
  });

  afterEach(() => {
    openURL.mockReset();
  });

  it('loads pages of the app domain in the WebView', async () => {
    const { result } = await renderHook(useLinkRouting, { wrapper });

    expect(result.current(createRequest('https://example.com/catalog/'))).toBe(
      true,
    );
    expect(openURL).not.toHaveBeenCalled();
  });

  it('blocks other links and opens them outside the app', async () => {
    const { result } = await renderHook(useLinkRouting, { wrapper });

    expect(result.current(createRequest('https://other.com/'))).toBe(false);
    expect(openURL).toHaveBeenCalledWith('https://other.com/');
  });
});
