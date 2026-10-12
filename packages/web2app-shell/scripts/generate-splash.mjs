import { existsSync, readFileSync } from 'node:fs';

import { runCommand } from './run-command.mjs';

const CONFIG_FILE = 'web-app-config.json';

/**
 * Generates the native boot splash from `splash` in the app's web-app-config.json.
 * Skips with a hint instead of failing while the config or its `splash` is missing,
 * so the setup still installs the dependencies.
 */
export const generateSplash = () => {
  const splash = existsSync(CONFIG_FILE)
    ? JSON.parse(readFileSync(CONFIG_FILE, 'utf8')).splash
    : undefined;

  if (!splash?.logo || !splash?.background) {
    console.log(
      `Splash skipped: set splash.logo and splash.background in ${CONFIG_FILE}, then run the setup again.`,
    );
    return;
  }

  runCommand('npx react-native-bootsplash generate', [
    splash.logo,
    '--platforms=android,ios',
    `--background=${splash.background}`,
    ...(splash.logoWidth ? [`--logo-width=${splash.logoWidth}`] : []),
  ]);
};
