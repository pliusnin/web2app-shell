import type { ImageOptions } from '@react-native-vector-icons/get-image';

const getImage = (glyph: string, { size = 24 }: ImageOptions) => ({
  uri: `icon://${glyph}`,
  width: size,
  height: size,
  scale: 1,
});

export const ensureNativeModuleAvailable = jest.fn();
export const getImageForFontSync = jest.fn(getImage);
export const getImageForFont = jest.fn(
  async (glyph: string, options: ImageOptions) => getImage(glyph, options),
);
