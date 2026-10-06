import { Platform, useColorScheme } from 'react-native';

import { useConfig } from '../config';
import { contrastColor, schemeColor } from '../utils';

export const useTabBarInactiveColor = () => {
  const { theme } = useConfig();
  const isDark = useColorScheme() === 'dark';

  if (Platform.OS !== 'android') {
    return undefined;
  }
  // Material picks the inactive color from the system theme, not from the bar background
  return (
    (theme.tabBarBg && contrastColor(theme.tabBarBg)) ?? schemeColor(isDark)
  );
};
