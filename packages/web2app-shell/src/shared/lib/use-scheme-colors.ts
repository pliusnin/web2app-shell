import { useColorScheme } from 'react-native';

import { COLORS } from '../config';

/**
 * Returns the background and text colors for the current system scheme and
 * re-renders the component when the user switches dark mode.
 */
export const useSchemeColors = () => {
  const isDark = useColorScheme() === 'dark';

  return {
    background: isDark ? COLORS.black : COLORS.white,
    foreground: isDark ? COLORS.white : COLORS.black,
  };
};
