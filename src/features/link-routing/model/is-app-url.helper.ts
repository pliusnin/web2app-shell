import { SITE_ORIGIN } from '../../../shared/config';

/**
 * Checks that the URL is a page of the bundled site on the local origin. Pages
 * of other sites and non-web URLs (tel:, mailto:) are never such.
 */
export const isAppUrlHelper = (url: string) =>
  url === SITE_ORIGIN || url.startsWith(`${SITE_ORIGIN}/`);
