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
    // Проект на TypeScript, а не на Flow. К тому же eslint-plugin-ft-flow@2
    // (приходит из @react-native/eslint-config) несовместим с ESLint 9.
    files: ['**/*.js'],
    rules: {
      'ft-flow/define-flow-type': 'off',
      'ft-flow/use-flow-type': 'off',
    },
  },
  {
    // Любое отклонение от .prettierrc.js (отступы, пробелы, кавычки, ...)
    // считается ошибкой линтера.
    plugins: { prettier: prettierPlugin },
    rules: {
      'prettier/prettier': 'error',
    },
  },
];
