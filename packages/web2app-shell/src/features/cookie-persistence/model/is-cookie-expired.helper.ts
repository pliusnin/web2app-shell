import type { Cookie } from '@preeternal/react-native-cookie-manager';

/**
 * Checks whether a cookie has expired. A cookie without an expiry lives until
 * the end of the session and is never considered expired.
 */
export const isCookieExpiredHelper = ({ expires }: Cookie) =>
  expires !== undefined && Date.parse(expires) <= Date.now();
