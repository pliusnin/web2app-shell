import { getHostHelper } from '../../../shared/lib';

/**
 * Checks whether the URL is on the same host as startUrl, i.e. belongs to
 * the website the app wraps. Non-web URLs (tel:, mailto:) never are.
 */
export const isAppUrlHelper = (url: string, startUrl: string) => {
  const host = getHostHelper(url);
  return host !== undefined && host === getHostHelper(startUrl);
};
