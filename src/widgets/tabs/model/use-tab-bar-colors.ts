import { Platform } from 'react-native';

import { useSchemeColors } from '../../../shared/lib';

/**
 * Returns the tab bar colors for the current color scheme. The inactive icon
 * color is set only on Android, iOS keeps the system one.
 */
export const useTabBarColors = () => {
  const { background, foreground } = useSchemeColors();

  return {
    background,
    inactiveTint: Platform.OS === 'android' ? foreground : undefined,
  };
};
