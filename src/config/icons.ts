import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons/static';
import type { MaterialDesignIconsIconName } from '@react-native-vector-icons/material-design-icons/static';
import type { ImageSourcePropType } from 'react-native';

// Icon names that web-app-config.json can use, mapped to Material Design Icons glyphs
const ICONS = {
  home: 'home',
  grid: 'view-grid',
  user: 'account',
  briefcase: 'briefcase',
  info: 'information',
  phone: 'phone',
} satisfies Record<string, MaterialDesignIconsIconName>;

const ICON_SIZE = 24;

// The tab bar takes images, so the font glyph is rendered to one.
// The tab bar tints it with the theme colors.
export const tabIcon = (name: string): ImageSourcePropType | undefined => {
  if (!(name in ICONS)) {
    if (__DEV__) {
      console.warn(`Unknown tab icon "${name}"`);
    }
    return undefined;
  }
  return MaterialDesignIcons.getImageSourceSync(
    ICONS[name as keyof typeof ICONS],
    ICON_SIZE,
  );
};
