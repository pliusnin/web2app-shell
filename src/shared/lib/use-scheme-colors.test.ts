import { useColorScheme } from 'react-native';
import { renderHook } from '@testing-library/react-native';

import { COLORS } from '../config';
import { useSchemeColors } from './use-scheme-colors';

const colorScheme = jest.mocked(useColorScheme);

describe('useSchemeColors', () => {
  it('gives a white background and black foreground in light mode', async () => {
    colorScheme.mockReturnValue('light');

    const { result } = await renderHook(useSchemeColors);

    expect(result.current).toEqual({
      background: COLORS.white,
      foreground: COLORS.black,
    });
  });

  it('gives a black background and white foreground in dark mode', async () => {
    colorScheme.mockReturnValue('dark');

    const { result } = await renderHook(useSchemeColors);

    expect(result.current).toEqual({
      background: COLORS.black,
      foreground: COLORS.white,
    });
  });

  it('falls back to light colors when the scheme is unknown', async () => {
    colorScheme.mockReturnValue(null);

    const { result } = await renderHook(useSchemeColors);

    expect(result.current).toEqual({
      background: COLORS.white,
      foreground: COLORS.black,
    });
  });
});
