import { COLORS } from '../../shared/config';

export const getSchemeBackgroundColorHelper = (isDark: boolean) =>
  isDark ? COLORS.black : COLORS.white;
