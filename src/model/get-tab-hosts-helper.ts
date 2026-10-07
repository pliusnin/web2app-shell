import type { TabConfig } from '../config';
import { getHost } from '../lib';

export const getTabHostsHelper = (tabs: Array<TabConfig>) =>
  new Set(tabs.map(tab => getHost(tab.url)).filter(host => host !== undefined));
