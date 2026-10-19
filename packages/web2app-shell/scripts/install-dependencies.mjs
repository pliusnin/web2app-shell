import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { runCommand } from './run-command.mjs';

const PATCH_PACKAGE_VERSION = '^8.0.1';

const readJson = path => JSON.parse(readFileSync(path, 'utf8'));
const sortKeys = object =>
  Object.fromEntries(
    Object.entries(object).sort(([a], [b]) => a.localeCompare(b)),
  );

/**
 * Добавляет в package.json приложения web2app-shell и недостающие peer-зависимости,
 * настраивает patch-package для патчей пакета и запускает npm install.
 * Нативные модули должны быть прямыми зависимостями приложения:
 * RN autolinking читает только package.json приложения.
 */
export const installDependencies = () => {
  const packageDir = join(dirname(fileURLToPath(import.meta.url)), '..');
  const appDir = process.cwd();
  const appPackageJson = join(appDir, 'package.json');
  const patchesDir = relative(appDir, join(packageDir, 'patches'));
  const hasPatches = existsSync(patchesDir);

  const shell = readJson(join(packageDir, 'package.json'));
  const app = readJson(appPackageJson);
  const appDependencies = { ...app.dependencies, ...app.devDependencies };

  // Версии, которые уже есть в приложении, сохраняются: npm сверяет их с peerDependencies
  // и падает при несовпадении.
  const missingPeers = Object.entries(shell.peerDependencies)
    .filter(([name]) => !(name in appDependencies))
    .map(([name, range]) => `${name}@${range}`);

  if (hasPatches) {
    const patchCommand = `patch-package --patch-dir ${patchesDir}`;
    const postinstall = app.scripts?.postinstall;
    if (!postinstall?.includes(patchCommand)) {
      app.scripts = {
        ...app.scripts,
        postinstall: postinstall
          ? `${postinstall} && ${patchCommand}`
          : patchCommand,
      };
    }
    if (!('patch-package' in appDependencies)) {
      app.devDependencies = sortKeys({
        ...app.devDependencies,
        'patch-package': PATCH_PACKAGE_VERSION,
      });
    }
    writeFileSync(appPackageJson, `${JSON.stringify(app, null, 2)}\n`);
  }

  runCommand('npm install', [
    `file:${relative(appDir, packageDir)}`,
    ...missingPeers,
  ]);

  // `npm install <package>` не запускает postinstall приложения, поэтому патчи применяются
  // здесь один раз.
  if (hasPatches) {
    runCommand('npx patch-package --patch-dir', [patchesDir]);
  }
};
