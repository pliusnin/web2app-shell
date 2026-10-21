import BootSplash from 'react-native-bootsplash';

/**
 * Hides the native splash with a fade. Called once there is something to
 * show, so the user does not see an empty WebView at startup.
 */
export const hideSplashHelper = () => {
  BootSplash.hide({ fade: true });
};
