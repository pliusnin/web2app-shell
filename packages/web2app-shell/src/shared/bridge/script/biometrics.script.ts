// Biometrics calls that wait for the app's reply: true or false
export const BIOMETRICS_SCRIPT = `
  bridge.verifyUser = () => callApp('VERIFY_USER');
  bridge.isBiometricsAvailable = () => callApp('IS_BIOMETRICS_AVAILABLE');
`;
