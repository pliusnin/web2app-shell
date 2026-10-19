import { defineConfig } from 'steiger';
import fsd from '@feature-sliced/steiger-plugin';

export default defineConfig([
  ...fsd.configs.recommended,
  {
    rules: {
      'fsd/no-wildcard-exports': 'error',
    },
  },
  {
    // Тесты лежат рядом со своими модулями, но сами не модули shared/lib
    files: ['./packages/web2app-shell/src/shared/lib/**/*.test.*'],
    rules: {
      'fsd/shared-lib-grouping': 'off',
    },
  },
]);
