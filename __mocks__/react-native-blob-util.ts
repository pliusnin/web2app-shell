export default {
  fs: {
    dirs: { CacheDir: '/cache', DocumentDir: '/documents' },
    exists: jest.fn(() => Promise.resolve(false)),
    hash: jest.fn(() => Promise.resolve('hash')),
    isDir: jest.fn(() => Promise.resolve(true)),
    mkdir: jest.fn(() => Promise.resolve()),
    writeFile: jest.fn(() => Promise.resolve()),
  },
};
