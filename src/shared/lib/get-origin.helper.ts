/**
 * Extracts the lowercase origin (scheme, host and port) from an http(s) URL to
 * tell pages of one site from others: "https://Example.com/portfolio/" →
 * "https://example.com". tel:, mailto: and other non-web URLs give undefined.
 */
export const getOriginHelper = (url: string) =>
  /^https?:\/\/[^/?#]+/i.exec(url)?.[0].toLowerCase();
