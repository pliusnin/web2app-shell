import type { Cookie } from '@preeternal/react-native-cookie-manager';

import type { StoredCookie } from './cookie-persistence.types';

/**
 * Binds a cookie to a URL for restoring: its domain or the host it was read
 * from. Keeps only the fields that cookie setting accepts.
 */
export const toStoredCookieHelper = (
  cookie: Cookie,
  readFromHost?: string,
): StoredCookie | null => {
  const {
    name,
    value,
    path = '/',
    domain,
    expires,
    secure,
    httpOnly,
    sameSite,
  } = cookie;
  const host = domain?.replace(/^\./, '') || readFromHost;
  if (!host) {
    return null;
  }

  return {
    url: `https://${host}${path}`,
    cookie: {
      name,
      value,
      path,
      // A domain without a leading dot is host-only: if set explicitly, Android
      // spreads the cookie to subdomains
      domain: domain?.startsWith('.') ? domain : undefined,
      expires,
      secure,
      httpOnly,
      // WebKit returns "none" for a cookie set without SameSite, while setting
      // rejects "none" without secure
      sameSite: sameSite === 'none' && !secure ? undefined : sameSite,
    },
  };
};
