import { COLORS } from '../config';

export const schemeForegroundColor = (isDark: boolean) =>
  isDark ? COLORS.white : COLORS.black;
