import type { Cookie } from '@preeternal/react-native-cookie-manager';

import type { StoredCookie } from './cookie-persistence.types';

/**
 * Связывает куку с URL для восстановления: её доменом или хостом, с которого
 * её прочитали. Оставляет только поля, которые принимает установка куки.
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
      // Домен без ведущей точки — только для хоста: если задать его явно,
      // Android распространит куку на поддомены
      domain: domain?.startsWith('.') ? domain : undefined,
      expires,
      secure,
      httpOnly,
      // WebKit отдаёт "none" для куки, поставленной без SameSite, а установка
      // отклоняет "none" без secure
      sameSite: sameSite === 'none' && !secure ? undefined : sameSite,
    },
  };
};
