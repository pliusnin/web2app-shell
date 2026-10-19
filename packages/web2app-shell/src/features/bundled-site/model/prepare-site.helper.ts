import { Platform } from 'react-native';
import { WebAppManager } from 'web-in-mobile-tools';

import { SITE_DIR, SITE_ZIP_NAME } from '../config/bundled-site';
import { addBridgeToSiteHelper } from './add-bridge-to-site.helper';
import { startSiteServerHelper } from './start-site-server.helper';

const webApp = new WebAppManager({
  appDir: SITE_DIR,
  bundledZipName: SITE_ZIP_NAME,
  platform: Platform.OS === 'ios' ? 'ios' : 'android',
});

/**
 * Делает встроенный сайт доступным на локальном origin: при первом запуске
 * распаковывает zip из приложения, добавляет мост и запускает сервер.
 * Должен завершиться до открытия WebView.
 */
export const prepareSiteHelper = async () => {
  await webApp.install();
  await addBridgeToSiteHelper();
  await startSiteServerHelper();
};
