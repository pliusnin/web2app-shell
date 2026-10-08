import { Platform, useColorScheme } from 'react-native';

import { getSchemeBackgroundColorHelper } from './get-scheme-background-color.helper';
import { getSchemeForegroundColorHelper } from './get-scheme-foreground-color.helper';

export const useTabBarColors = () => {
  const isDark = useColorScheme() === 'dark';

  return {
    background: getSchemeBackgroundColorHelper(isDark),
    inactiveTint:
      Platform.OS === 'android'
        ? getSchemeForegroundColorHelper(isDark)
        : undefined,
  };
};
