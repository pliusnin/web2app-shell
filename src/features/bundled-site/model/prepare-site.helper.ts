import { installBundledSiteHelper } from './install-bundled-site.helper';
import { startSiteServerHelper } from './start-site-server.helper';

/**
 * Makes the bundled site available on the local origin: unpacks the zip from
 * the app when the site is missing or the archive changed, and starts the
 * server. Must finish before the WebView opens.
 */
export const prepareSiteHelper = async () => {
  await installBundledSiteHelper();
  await startSiteServerHelper();
};
