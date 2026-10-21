import type {
  Cookie,
  CookieSameSite,
} from '@preeternal/react-native-cookie-manager';
import { parseSetCookie } from 'set-cookie-parser';

/**
 * Turns the Set-Cookie header of the session check into cookies for the site,
 * with the lifetime and attributes set by the server. The domain is dropped:
 * it is the API host, while the cookies belong to the site.
 */
export const toSiteCookiesHelper = (setCookieHeader: string): Array<Cookie> =>
  // React Native fetch has no getSetCookie(); the parser splits the joined
  // header itself
  parseSetCookie(setCookieHeader, { decodeValues: false })
    .filter(({ name }) => name)
    .map(
      ({ name, value, path, expires, maxAge, secure, httpOnly, sameSite }) => ({
        name,
        value,
        path: path || '/',
        expires:
          expires && !isNaN(expires.getTime())
            ? expires.toISOString()
            : undefined,
        maxAge,
        secure,
        httpOnly,
        sameSite: sameSite?.toLowerCase() as CookieSameSite | undefined,
      }),
    );
