import type { TabConfig } from '../config';
import { tabIcon } from './tab-icon';
import type { TabRoute } from './types';

export const toTabRoute = (tab: TabConfig, index: number): TabRoute => ({
  key: `tab-${index}`,
  title: tab.title,
  uri: tab.url,
  focusedIcon: tabIcon(tab.icon),
});
