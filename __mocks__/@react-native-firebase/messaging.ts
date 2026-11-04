export const getMessaging = jest.fn(() => ({}));
export const onMessage = jest.fn(() => jest.fn());
export const setBackgroundMessageHandler = jest.fn();
export const getAPNSToken = jest.fn(() => Promise.resolve('apns-token'));
export const getToken = jest.fn(() => Promise.resolve('fcm-token'));
export const subscribeToTopic = jest.fn(() => Promise.resolve());
