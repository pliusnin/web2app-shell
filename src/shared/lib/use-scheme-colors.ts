import { useColorScheme } from 'react-native';

import { getSchemeBackgroundColorHelper } from './get-scheme-background-color.helper';
import { getSchemeForegroundColorHelper } from './get-scheme-foreground-color.helper';

/**
 * Returns the background and foreground colors for the current system color
 * scheme and re-renders when the user switches dark mode.
 */
export const useSchemeColors = () => {
  const isDark = useColorScheme() === 'dark';

  return {
    background: getSchemeBackgroundColorHelper(isDark),
    foreground: getSchemeForegroundColorHelper(isDark),
  };
};
