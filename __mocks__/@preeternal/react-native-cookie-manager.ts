export default {
  getAllAsArray: jest.fn(() => Promise.resolve([])),
  getAsArray: jest.fn(() => Promise.resolve([])),
  set: jest.fn(() => Promise.resolve(true)),
  clearByName: jest.fn(() => Promise.resolve(true)),
  flush: jest.fn(() => Promise.resolve()),
};
