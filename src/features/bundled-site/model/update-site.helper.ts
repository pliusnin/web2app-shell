import { webApp } from './web-app-manager';

/**
 * Checks the archive published at `zipUrl` and, when it is newer than the
 * installed site, downloads and swaps it in for the next launch. The running
 * site is left untouched and the swap is atomic, so this is safe while the
 * server is serving. Throttled and de-duplicated inside the manager.
 */
export const updateSiteHelper = (zipUrl: string) =>
  webApp.updateIfNewer(zipUrl);
