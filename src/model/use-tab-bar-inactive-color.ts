import { Platform, useColorScheme } from 'react-native';

import { schemeForegroundColor } from './scheme-foreground-color';

export const useTabBarInactiveColor = () => {
  const isDark = useColorScheme() === 'dark';

  if (Platform.OS !== 'android') {
    return undefined;
  }
  return schemeForegroundColor(isDark);
};
