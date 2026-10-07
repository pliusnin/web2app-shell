import { COLORS } from '../config';

export const getSchemeForegroundColorHelper = (isDark: boolean) =>
  isDark ? COLORS.white : COLORS.black;
