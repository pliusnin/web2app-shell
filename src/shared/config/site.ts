// An IP address needs no DNS lookup: Android blocks such lookups, including
// "localhost", while the app has no network access (for example, when launched
// with a locked screen)
export const SITE_HOSTNAME = '127.0.0.1';
// A fixed port keeps the origin, and with it the site storage, the same
// across launches
export const SITE_PORT = 3035;
export const SITE_ORIGIN = `http://${SITE_HOSTNAME}:${SITE_PORT}`;
