import type { ImageSourcePropType } from 'react-native';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons/static';

import { TAB_ICON_SIZE, TAB_ICONS } from '../config/tab-icons';

/**
 * Turns the icon name from the tab config into a Material Design image for
 * the native tab bar, which takes images, not components. An unknown name
 * gives no icon and a dev warning, so a typo in the config doesn't crash.
 */
export const getTabIconHelper = (
  name: string,
): ImageSourcePropType | undefined => {
  if (!(name in TAB_ICONS)) {
    if (__DEV__) {
      console.warn(`Unknown tab icon "${name}"`);
    }
    return undefined;
  }
  return MaterialDesignIcons.getImageSourceSync(
    TAB_ICONS[name as keyof typeof TAB_ICONS],
    TAB_ICON_SIZE,
  );
};
