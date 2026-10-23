import type { Cookie } from '@preeternal/react-native-cookie-manager';

// A cookie and the URL it is set for when restoring
export type StoredCookie = {
  url: string;
  cookie: Cookie;
};

export type StoredCookies = {
  hosts: Array<string>;
  cookies: Array<StoredCookie>;
};
