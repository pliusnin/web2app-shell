// "https://symfonyart.com/portfolio/" → "symfonyart.com".
// tel:, mailto: and other non-web URLs have no host
export const getHost = (url: string) =>
  /^https?:\/\/([^/:?#]+)/i.exec(url)?.[1].toLowerCase();
