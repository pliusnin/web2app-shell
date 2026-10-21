const reactNativeConfig = require('@react-native/eslint-config/flat');
const prettierPlugin = require('eslint-plugin-prettier');

module.exports = [
  {
    ignores: [
      'android/',
      'ios/',
      'vendor/',
      'coverage/',
      '.bundle/',
      '**/build/',
    ],
  },
  ...reactNativeConfig,
  {
    // The project uses TypeScript, not Flow. Also, eslint-plugin-ft-flow@2
    // (comes from @react-native/eslint-config) is incompatible with ESLint 9.
    files: ['**/*.js'],
    rules: {
      'ft-flow/define-flow-type': 'off',
      'ft-flow/use-flow-type': 'off',
    },
  },
  {
    // Any deviation from .prettierrc.js (indents, spaces, quotes, ...)
    // is treated as a linter error.
    plugins: { prettier: prettierPlugin },
    rules: {
      'prettier/prettier': 'error',
    },
  },
];
