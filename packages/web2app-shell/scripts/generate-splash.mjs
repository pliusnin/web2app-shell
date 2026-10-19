import { existsSync, readFileSync } from 'node:fs';

import { runCommand } from './run-command.mjs';

const CONFIG_FILE = 'web-app-config.json';

/**
 * Генерирует нативный boot splash из `splash` в web-app-config.json приложения.
 * Если конфига или его `splash` нет, пропускает шаг с подсказкой вместо ошибки,
 * чтобы setup всё равно установил зависимости.
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
