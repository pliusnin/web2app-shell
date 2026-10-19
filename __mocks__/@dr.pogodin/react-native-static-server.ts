export const STATES = { ACTIVE: 1, CRASHED: 2 };
export const getActiveServerId = jest.fn(() => Promise.resolve(null));

export default class StaticServer {
  start = jest.fn(() => Promise.resolve('http://127.0.0.1:3035'));
  addStateListener = jest.fn();
}
