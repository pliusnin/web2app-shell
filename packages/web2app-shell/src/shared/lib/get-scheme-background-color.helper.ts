import { COLORS } from '../config';

/**
 * Returns the base background color for the color scheme: black in dark
 * mode, white in light mode, so the app chrome follows the system theme.
 */
export const getSchemeBackgroundColorHelper = (isDark: boolean) =>
  isDark ? COLORS.black : COLORS.white;
