#!/usr/bin/env node
// Настраивает web2app-shell в приложении: зависимости, затем boot splash из web-app-config.json.
// Можно запускать повторно, например после смены логотипа splash или обновления пакета.
// Запуск из корня приложения: node packages/web2app-shell/scripts/setup.mjs

import { existsSync } from 'node:fs';

import { generateSplash } from './generate-splash.mjs';
import { installDependencies } from './install-dependencies.mjs';

if (!existsSync('package.json')) {
  console.error('package.json not found. Run the command from the app root.');
  process.exit(1);
}

installDependencies();
generateSplash();
