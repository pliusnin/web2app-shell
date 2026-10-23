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
    // Tests sit next to their modules but are not shared/lib modules themselves
    files: ['./src/shared/lib/**/*.test.*'],
    rules: {
      'fsd/shared-lib-grouping': 'off',
    },
  },
]);
