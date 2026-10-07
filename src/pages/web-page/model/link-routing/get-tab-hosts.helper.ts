import type { TabConfig } from '../../../../shared/config';
import { getHostHelper } from '../../../../shared/lib';

export const getTabHostsHelper = (tabs: Array<TabConfig>) =>
  new Set(
    tabs.map(tab => getHostHelper(tab.url)).filter(host => host !== undefined),
  );
