module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['./jest.setup.ts'],
  // Ignore git worktrees the desktop app keeps under .claude: their duplicate
  // __mocks__ otherwise break jest-haste-map
  modulePathIgnorePatterns: ['/.claude/'],
};
