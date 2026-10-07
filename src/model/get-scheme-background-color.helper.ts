import { COLORS } from '../config';

export const getSchemeBackgroundColorHelper = (isDark: boolean) =>
  isDark ? COLORS.black : COLORS.white;
