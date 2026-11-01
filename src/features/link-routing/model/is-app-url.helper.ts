import { getOriginHelper } from '../../../shared/lib';

/**
 * Checks that the URL is a page of the tab's site: same origin as the tab URL,
 * port included. Pages of other sites and non-web URLs (tel:, mailto:) are
 * never such.
 */
export const isAppUrlHelper = (url: string, tabUrl: string) => {
  const tabOrigin = getOriginHelper(tabUrl);
  return tabOrigin !== undefined && getOriginHelper(url) === tabOrigin;
};
