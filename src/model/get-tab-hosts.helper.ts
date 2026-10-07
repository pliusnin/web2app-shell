import type { TabConfig } from './app-config.types';
import { getHostHelper } from '../lib';

export const getTabHostsHelper = (tabs: Array<TabConfig>) =>
  new Set(
    tabs.map(tab => getHostHelper(tab.url)).filter(host => host !== undefined),
  );
