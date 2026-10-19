export const isSensorAvailable = jest.fn(() =>
  Promise.resolve({ available: false, isDeviceSecure: false }),
);
export const simplePrompt = jest.fn(() => Promise.resolve({ success: false }));
