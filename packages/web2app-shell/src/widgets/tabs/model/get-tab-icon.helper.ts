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
 * Превращает имя Material Design Icons из конфига таба в изображение для
 * нативного таб-бара: он принимает изображения, а не компоненты. Неизвестное
 * имя даёт таб без иконки и предупреждение в dev вместо глифа "?" библиотеки.
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
