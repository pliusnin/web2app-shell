import type { Cookie } from '@preeternal/react-native-cookie-manager';

// Кука и URL, для которого её ставят при восстановлении
export type StoredCookie = {
  url: string;
  cookie: Cookie;
};

export type StoredCookies = {
  hosts: Array<string>;
  cookies: Array<StoredCookie>;
};
