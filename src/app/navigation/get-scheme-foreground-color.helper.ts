import { COLORS } from '../../shared/config';

export const getSchemeForegroundColorHelper = (isDark: boolean) =>
  isDark ? COLORS.white : COLORS.black;
