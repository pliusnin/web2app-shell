import { MAX_VISITED_HOSTS } from '../config/cookie-storage';

let hosts: Array<string> = [];

// Hosts opened in the WebView, latest first
export const visitedHosts = {
  get: () => hosts,
  add: (newHosts: Array<string>) => {
    hosts = [...new Set([...newHosts, ...hosts])].slice(0, MAX_VISITED_HOSTS);
  },
};
