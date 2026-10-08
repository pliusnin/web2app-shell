import BootSplash from 'react-native-bootsplash';

/**
 * Hides the native boot splash with a fade. Called once there is something
 * to show, so the user never sees an empty WebView on start.
 */
export const hideSplashHelper = () => {
  BootSplash.hide({ fade: true });
};
