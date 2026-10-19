import { BackHandler, Linking } from 'react-native';
import { act, renderHook } from '@testing-library/react-native';

import type { TabRoute } from './tabs.types';
import { useTabNavigation } from './use-tab-navigation';

const ROUTES: Array<TabRoute> = [
  {
    key: 'tab-0',
    title: 'Home',
    uri: 'https://example.com/',
    isExternal: false,
  },
  {
    key: 'tab-1',
    title: 'Catalog',
    uri: 'https://example.com/catalog/',
    isExternal: false,
  },
  {
    key: 'tab-2',
    title: 'Blog',
    uri: 'https://blog.other.com/',
    isExternal: true,
  },
];

// По типам RN это Promise<void>, но нативный модуль возвращает, открылся ли
// URL
const openURL = Linking.openURL as unknown as jest.Mock<
  Promise<boolean>,
  [string]
>;

// Jest подключает iOS-версию BackHandler, которая не вызывает обработчики,
// поэтому тест сам нажимает «назад»
const mockBackHandler = () => {
  let onBackPress:
    Parameters<typeof BackHandler.addEventListener>[1] | undefined;
  jest
    .spyOn(BackHandler, 'addEventListener')
    .mockImplementation((_eventName, handler) => {
      onBackPress = handler;
      return { remove: jest.fn() };
    });

  return () => onBackPress?.({ type: 'hardwareBackPress', timeStamp: 0 });
};

const renderTabNavigation = async (startIndex = 0) => {
  const pressBack = mockBackHandler();
  const webViews = {
    resetToRoot: jest.fn(),
    tryGoBack: jest.fn(() => true),
  };
  const { result } = await renderHook(() =>
    useTabNavigation(ROUTES, startIndex, webViews),
  );

  return { result, webViews, pressBack };
};

describe('useTabNavigation', () => {
  beforeEach(() => {
    openURL.mockResolvedValue(true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    openURL.mockReset();
  });

  it('starts at the start tab', async () => {
    const { result } = await renderTabNavigation(1);

    expect(result.current.index).toBe(1);
  });

  it('switches to another tab', async () => {
    const { result, webViews } = await renderTabNavigation();

    await act(() => result.current.onIndexChange(1));

    expect(result.current.index).toBe(1);
    expect(webViews.resetToRoot).not.toHaveBeenCalled();
  });

  it('returns the active tab to its root URL when it is pressed again', async () => {
    const { result, webViews } = await renderTabNavigation(1);

    await act(() => result.current.onIndexChange(1));

    expect(webViews.resetToRoot).toHaveBeenCalledWith(
      'tab-1',
      'https://example.com/catalog/',
    );
    expect(result.current.index).toBe(1);
  });

  it('opens an external tab outside the app and stays on the current tab', async () => {
    const { result, webViews } = await renderTabNavigation();

    await act(() => result.current.onIndexChange(2));

    expect(openURL).toHaveBeenCalledWith('https://blog.other.com/');
    expect(result.current.index).toBe(0);
    expect(webViews.resetToRoot).not.toHaveBeenCalled();
  });

  it('goes back in the active tab on the Android back button', async () => {
    const { result, webViews, pressBack } = await renderTabNavigation();

    await act(() => result.current.onIndexChange(1));

    expect(pressBack()).toBe(true);
    expect(webViews.tryGoBack).toHaveBeenCalledWith('tab-1');
  });

  it('leaves the back press to the system when the tab has no history', async () => {
    const { webViews, pressBack } = await renderTabNavigation();
    webViews.tryGoBack.mockReturnValue(false);

    expect(pressBack()).toBe(false);
    expect(webViews.tryGoBack).toHaveBeenCalledWith('tab-0');
  });
});
