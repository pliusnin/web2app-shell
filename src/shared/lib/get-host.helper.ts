/**
 * Extracts the lowercased host from an http(s) URL so links can be compared
 * by domain: "https://symfonyart.com/portfolio/" → "symfonyart.com".
 * tel:, mailto: and other non-web URLs have no host and give undefined.
 */
export const getHostHelper = (url: string) =>
  /^https?:\/\/([^/:?#]+)/i.exec(url)?.[1].toLowerCase();
