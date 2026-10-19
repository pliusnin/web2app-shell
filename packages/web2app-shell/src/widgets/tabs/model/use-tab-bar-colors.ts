import { Platform } from 'react-native';

import { useSchemeColors } from '../../../shared/lib';

/**
 * Возвращает цвета таб-бара для текущей цветовой схемы. Цвет неактивной
 * иконки задаётся только на Android, iOS оставляет системный.
 */
export const useTabBarColors = () => {
  const { background, foreground } = useSchemeColors();

  return {
    background,
    inactiveTint: Platform.OS === 'android' ? foreground : undefined,
  };
};
