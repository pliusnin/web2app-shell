import { isAppUrlHelper } from '../../../features/link-routing';
import { SITE_ORIGIN, type TabConfig } from '../../../shared/config';
import { getOutlineTabIconHelper } from './get-outline-tab-icon.helper';
import { getTabIconHelper } from './get-tab-icon.helper';
import type { TabRoute } from './tabs.types';

/**
 * Turns a tab from the config into a tab bar route: key, title, a URL on the
 * local origin for a site path ("/catalog"), a filled icon for the active tab
 * and an outline one for the inactive tab, isExternal for tabs with another
 * site's URL that open outside the app instead of switching the tab.
 */
export const mapTabToRouteHelper = (
  tab: TabConfig,
  index: number,
): TabRoute => {
  const uri = tab.url.startsWith('/') ? `${SITE_ORIGIN}${tab.url}` : tab.url;

  return {
    key: `tab-${index}`,
    title: tab.title,
    uri,
    isExternal: !isAppUrlHelper(uri),
    focusedIcon: getTabIconHelper(tab.icon),
    unfocusedIcon: getOutlineTabIconHelper(tab.icon),
  };
};
