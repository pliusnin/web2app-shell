export default {
  fs: {
    dirs: { CacheDir: '/cache', DocumentDir: '/documents' },
    isDir: jest.fn(() => Promise.resolve(true)),
    mkdir: jest.fn(() => Promise.resolve()),
    readFile: jest.fn(() => Promise.resolve('<html><head></head></html>')),
    writeFile: jest.fn(() => Promise.resolve()),
  },
};
