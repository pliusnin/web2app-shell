import { isAppUrlHelper } from '../../../features/link-routing';
import type { TabConfig } from '../../../shared/config';
import { getTabIconHelper } from './get-tab-icon.helper';
import type { TabRoute } from './tabs.types';

/**
 * Converts a tab from the config into a tab bar route: key, title, URL,
 * icon, and isExternal for tabs outside the app domain, which open outside
 * the app instead of switching the tab.
 */
export const mapTabToRouteHelper = (
  tab: TabConfig,
  index: number,
  startUrl: string,
): TabRoute => ({
  key: `tab-${index}`,
  title: tab.title,
  uri: tab.url,
  isExternal: !isAppUrlHelper(tab.url, startUrl),
  focusedIcon: getTabIconHelper(tab.icon),
});
