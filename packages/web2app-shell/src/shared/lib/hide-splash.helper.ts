import BootSplash from 'react-native-bootsplash';

/**
 * Скрывает нативный сплэш с затуханием. Вызывается, когда уже есть что
 * показать, чтобы пользователь не увидел пустой WebView при старте.
 */
export const hideSplashHelper = () => {
  BootSplash.hide({ fade: true });
};
