import type { TabConfig } from '../../shared/config';
import { getTabIconHelper } from './get-tab-icon.helper';
import type { TabRoute } from './tabs.types';

export const mapTabToRouteHelper = (
  tab: TabConfig,
  index: number,
): TabRoute => ({
  key: `tab-${index}`,
  title: tab.title,
  uri: tab.url,
  focusedIcon: getTabIconHelper(tab.icon),
});
