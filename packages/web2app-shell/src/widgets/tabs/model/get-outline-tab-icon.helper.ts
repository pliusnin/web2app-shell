import glyphMap from '@react-native-vector-icons/material-design-icons/glyphmaps/MaterialDesignIcons.json';

import { getTabIconHelper } from './get-tab-icon.helper';

/**
 * Возвращает контурный вариант иконки таба ("home" → "home-outline") для
 * неактивного таба или undefined, если у иконки его нет: тогда таб-бар
 * показывает залитую иконку в обоих состояниях.
 */
export const getOutlineTabIconHelper = (name: string) => {
  const outlineName = `${name}-outline`;
  return Object.hasOwn(glyphMap, outlineName)
    ? getTabIconHelper(outlineName)
    : undefined;
};
