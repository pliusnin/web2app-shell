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
    // The project uses TypeScript, not Flow. eslint-plugin-ft-flow@2 (pulled in
    // by @react-native/eslint-config) is also incompatible with ESLint 9.
    files: ['**/*.js'],
    rules: {
      'ft-flow/define-flow-type': 'off',
      'ft-flow/use-flow-type': 'off',
    },
  },
  {
    // Any deviation from .prettierrc.js (indentation, spacing, quotes, ...)
    // is reported as a lint error.
    plugins: { prettier: prettierPlugin },
    rules: {
      'prettier/prettier': 'error',
    },
  },
];
