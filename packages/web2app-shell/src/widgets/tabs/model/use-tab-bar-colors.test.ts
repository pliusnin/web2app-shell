import { Platform, useColorScheme } from 'react-native';
import { renderHook } from '@testing-library/react-native';

import { COLORS } from '../../../shared/config';
import { useTabBarColors } from './use-tab-bar-colors';

describe('useTabBarColors', () => {
  beforeEach(() => {
    jest.mocked(useColorScheme).mockReturnValue('dark');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('paints the tab bar in the scheme background', async () => {
    const { result } = await renderHook(useTabBarColors);

    expect(result.current.background).toBe(COLORS.black);
  });

  it('uses the scheme foreground for inactive tabs on Android', async () => {
    jest.replaceProperty(Platform, 'OS', 'android');

    const { result } = await renderHook(useTabBarColors);

    expect(result.current.inactiveTint).toBe(COLORS.white);
  });

  it('keeps the system color for inactive tabs on iOS', async () => {
    jest.replaceProperty(Platform, 'OS', 'ios');

    const { result } = await renderHook(useTabBarColors);

    expect(result.current.inactiveTint).toBeUndefined();
  });
});
