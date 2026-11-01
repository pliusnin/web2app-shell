import { Linking } from 'react-native';

import type { ShouldStartLoadRequest } from '../../../shared/lib';
import { routeLinkRequestHelper } from './route-link-request.helper';

const TAB_URL = 'https://app.example.com/orders';

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

// RN types say Promise<void>, but the native module resolves whether the URL
// opened
const openURL = Linking.openURL as unknown as jest.Mock<
  Promise<boolean>,
  [string]
>;

describe('routeLinkRequestHelper', () => {
  beforeEach(() => {
    openURL.mockResolvedValue(true);
  });

  afterEach(() => {
    openURL.mockReset();
  });

  it('loads pages of the tab site in the WebView', () => {
    expect(
      routeLinkRequestHelper(
        createRequest('https://app.example.com/catalog'),
        TAB_URL,
      ),
    ).toBe(true);
    expect(openURL).not.toHaveBeenCalled();
  });

  it('blocks other links and opens them outside the app', () => {
    expect(
      routeLinkRequestHelper(createRequest('https://other.com/'), TAB_URL),
    ).toBe(false);
    expect(openURL).toHaveBeenCalledWith('https://other.com/');
  });
});
