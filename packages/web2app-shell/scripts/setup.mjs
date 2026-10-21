#!/usr/bin/env node
// Sets up web2app-shell in the app: dependencies, then the boot splash from
// web-app-config.json. Can be run again, e.g. after changing the splash logo or
// updating the package.
// Run from the app root: node packages/web2app-shell/scripts/setup.mjs

import { existsSync } from 'node:fs';

import { generateSplash } from './generate-splash.mjs';
import { installDependencies } from './install-dependencies.mjs';

if (!existsSync('package.json')) {
  console.error('package.json not found. Run the command from the app root.');
  process.exit(1);
}

installDependencies();
generateSplash();
