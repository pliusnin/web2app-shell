const BLACK = '#000000';
const WHITE = '#FFFFFF';

const toRgb = (hex: string) => {
  const digits = hex.replace('#', '');
  const full =
    digits.length === 3
      ? [...digits].map(digit => digit + digit).join('')
      : digits;
  if (!/^[0-9a-f]{6}$/i.test(full)) {
    return undefined;
  }
  return [0, 2, 4].map(start => parseInt(full.slice(start, start + 2), 16));
};

// Perceived brightness per ITU-R BT.601
export const contrastColor = (background: string) => {
  const rgb = toRgb(background);
  if (!rgb) {
    return undefined;
  }
  const [red, green, blue] = rgb;
  const brightness = (red * 299 + green * 587 + blue * 114) / 1000;

  return brightness > 128 ? BLACK : WHITE;
};

export const schemeColor = (isDark: boolean) => (isDark ? WHITE : BLACK);
