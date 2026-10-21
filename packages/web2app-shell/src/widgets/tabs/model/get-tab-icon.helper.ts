import type { ImageSourcePropType } from 'react-native';
import {
  MaterialDesignIcons,
  type MaterialDesignIconsIconName,
} from '@react-native-vector-icons/material-design-icons/static';
import glyphMap from '@react-native-vector-icons/material-design-icons/glyphmaps/MaterialDesignIcons.json';

import { TAB_ICON_SIZE } from '../config/tab-icons';

const isIconName = (name: string): name is MaterialDesignIconsIconName =>
  Object.hasOwn(glyphMap, name);

/**
 * Turns a Material Design Icons name from the tab config into an image for
 * the native tab bar: it takes images, not components. An unknown name gives
 * a tab without an icon and a dev warning instead of the library's "?" glyph.
 */
export const getTabIconHelper = (
  name: string,
): ImageSourcePropType | undefined => {
  if (!isIconName(name)) {
    if (__DEV__) {
      console.warn(`Unknown tab icon "${name}"`);
    }
    return undefined;
  }
  return MaterialDesignIcons.getImageSourceSync(name, TAB_ICON_SIZE);
};
