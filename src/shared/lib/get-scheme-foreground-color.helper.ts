import { COLORS } from '../config';

/**
 * Returns the base foreground color for the color scheme, contrasting with
 * the scheme background: white in dark mode, black in light mode.
 */
export const getSchemeForegroundColorHelper = (isDark: boolean) =>
  isDark ? COLORS.white : COLORS.black;
