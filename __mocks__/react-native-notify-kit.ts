export const AndroidImportance = { HIGH: 4 };

export default {
  createChannel: jest.fn(() => Promise.resolve('default')),
  requestPermission: jest.fn(() => Promise.resolve({})),
  displayNotification: jest.fn(() => Promise.resolve('id')),
};
