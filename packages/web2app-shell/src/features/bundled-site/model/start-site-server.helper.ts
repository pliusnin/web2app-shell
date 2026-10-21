import { Platform } from 'react-native';
import StaticServer, {
  getActiveServerId,
  STATES,
} from '@dr.pogodin/react-native-static-server';

import { SITE_HOSTNAME, SITE_PORT } from '../../../shared/config';
import { SITE_DIR } from '../config/bundled-site';

// The site is a single-page app: its pages have no files of their own, so any
// path without a file gets index.html and the site does the routing itself
const SPA_FALLBACK_CONFIG = `
  server.modules += ("mod_rewrite")
  url.rewrite-if-not-file = ("" => "/index.html")
`;

const createServer = async () => {
  // In development the native server survives a JS reload: connecting to it
  // keeps a second server from failing on the same port
  const activeServerId = await getActiveServerId();

  return new StaticServer({
    fileDir: SITE_DIR,
    hostname: SITE_HOSTNAME,
    port: SITE_PORT,
    // iOS kills the app's socket in the background, so the server is restarted
    // when the app returns to the foreground
    stopInBackground: Platform.OS === 'ios',
    extraConfig: SPA_FALLBACK_CONFIG,
    ...(activeServerId !== null && {
      id: activeServerId,
      state: STATES.ACTIVE,
    }),
  });
};

/**
 * Serves the unpacked site on a fixed local origin. Resolves once the server
 * starts responding to requests.
 */
export const startSiteServerHelper = async () => {
  const server = await createServer();
  // Without a listener the library loses the cause of an autostart failure
  // after backgrounding and throws an unhandled error without it
  server.addStateListener((state, details, error) => {
    if (state === STATES.CRASHED) {
      console.warn(`Site server crashed: ${details}`, error);
    }
  });
  await server.start('app launch');
};
