import type { ImageSourcePropType } from 'react-native';

export type TabRoute = {
  key: string;
  title: string;
  uri: string;
  focusedIcon?: ImageSourcePropType;
};
