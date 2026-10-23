// Checks the saved token on the site's server. For a valid token returns the
// response: its Set-Cookie headers sign in on the site. For an invalid one
// returns null; if the check fails (no network) throws an error
export type CheckSession = (token: string) => Promise<Response | null>;

export type StoredSession = {
  token: string;
  // Cookies the app set for the session; removed when it ends
  cookieNames: Array<string>;
};
