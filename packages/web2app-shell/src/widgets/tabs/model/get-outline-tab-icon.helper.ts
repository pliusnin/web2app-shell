import glyphMap from '@react-native-vector-icons/material-design-icons/glyphmaps/MaterialDesignIcons.json';

import { getTabIconHelper } from './get-tab-icon.helper';

/**
 * Returns the outline variant of a tab icon ("home" → "home-outline") for an
 * inactive tab, or undefined if the icon has none: then the tab bar shows
 * the filled icon in both states.
 */
export const getOutlineTabIconHelper = (name: string) => {
  const outlineName = `${name}-outline`;
  return Object.hasOwn(glyphMap, outlineName)
    ? getTabIconHelper(outlineName)
    : undefined;
};
