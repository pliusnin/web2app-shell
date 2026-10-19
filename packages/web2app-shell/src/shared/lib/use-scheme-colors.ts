import { useColorScheme } from 'react-native';

import { COLORS } from '../config';

/**
 * Возвращает цвета фона и текста для текущей системной схемы и
 * перерисовывает компонент, когда пользователь переключает тёмную тему.
 */
export const useSchemeColors = () => {
  const isDark = useColorScheme() === 'dark';

  return {
    background: isDark ? COLORS.black : COLORS.white,
    foreground: isDark ? COLORS.white : COLORS.black,
  };
};
