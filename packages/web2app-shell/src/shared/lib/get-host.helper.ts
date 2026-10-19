/**
 * Извлекает хост в нижнем регистре из http(s) URL, чтобы сравнивать ссылки
 * по домену: "https://symfonyart.com/portfolio/" → "symfonyart.com".
 * У tel:, mailto: и других не-веб URL хоста нет, они дают undefined.
 */
export const getHostHelper = (url: string) =>
  /^https?:\/\/([^/:?#]+)/i.exec(url)?.[1].toLowerCase();
