import { MAX_VISITED_HOSTS } from '../config/cookie-storage';

let hosts: Array<string> = [];

// Хосты, открытые в WebView, последние — первыми
export const visitedHosts = {
  get: () => hosts,
  add: (newHosts: Array<string>) => {
    hosts = [...new Set([...newHosts, ...hosts])].slice(0, MAX_VISITED_HOSTS);
  },
};
