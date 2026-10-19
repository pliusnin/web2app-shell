import { SITE_ORIGIN } from '../../../shared/config';

/**
 * Проверяет, что URL — страница встроенного сайта на локальном origin.
 * Страницы других сайтов и не-веб URL (tel:, mailto:) ею не бывают.
 */
export const isAppUrlHelper = (url: string) =>
  url === SITE_ORIGIN || url.startsWith(`${SITE_ORIGIN}/`);
