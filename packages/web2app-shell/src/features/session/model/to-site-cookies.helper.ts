import type {
  Cookie,
  CookieSameSite,
} from '@preeternal/react-native-cookie-manager';
import { parseSetCookie } from 'set-cookie-parser';

/**
 * Превращает заголовок Set-Cookie из проверки сессии в куки для сайта
 * с тем сроком жизни и атрибутами, что задал сервер. Домен отбрасывается:
 * это хост API, а куки принадлежат сайту.
 */
export const toSiteCookiesHelper = (setCookieHeader: string): Array<Cookie> =>
  // В fetch React Native нет getSetCookie(), парсер сам делит склеенный
  // заголовок
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
