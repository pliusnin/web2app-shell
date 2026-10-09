export const getMessaging = jest.fn(() => ({}));
export const onMessage = jest.fn(() => jest.fn());
export const registerDeviceForRemoteMessages = jest.fn(() => Promise.resolve());
export const subscribeToTopic = jest.fn(() => Promise.resolve());
