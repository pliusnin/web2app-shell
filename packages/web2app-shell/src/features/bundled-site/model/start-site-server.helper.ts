import { Platform } from 'react-native';
import StaticServer, {
  getActiveServerId,
  STATES,
} from '@dr.pogodin/react-native-static-server';

import { SITE_HOSTNAME, SITE_PORT } from '../../../shared/config';
import { SITE_DIR } from '../config/bundled-site';

// Сайт — одностраничное приложение: у его страниц нет своих файлов, поэтому
// на любой путь без файла отдаётся index.html, а маршрутизирует сам сайт
const SPA_FALLBACK_CONFIG = `
  server.modules += ("mod_rewrite")
  url.rewrite-if-not-file = ("" => "/index.html")
`;

const createServer = async () => {
  // В разработке нативный сервер переживает перезагрузку JS: подключение
  // к нему не даёт второму серверу упасть на том же порту
  const activeServerId = await getActiveServerId();

  return new StaticServer({
    fileDir: SITE_DIR,
    hostname: SITE_HOSTNAME,
    port: SITE_PORT,
    // iOS убивает сокет приложения в фоне, сервер перезапускается
    // при возврате на передний план
    stopInBackground: Platform.OS === 'ios',
    extraConfig: SPA_FALLBACK_CONFIG,
    ...(activeServerId !== null && {
      id: activeServerId,
      state: STATES.ACTIVE,
    }),
  });
};

/**
 * Раздаёт распакованный сайт на фиксированном локальном origin. Резолвится,
 * когда сервер начинает отвечать на запросы.
 */
export const startSiteServerHelper = async () => {
  const server = await createServer();
  // Без слушателя библиотека теряет причину сбоя автозапуска после фона и
  // бросает необработанную ошибку без неё
  server.addStateListener((state, details, error) => {
    if (state === STATES.CRASHED) {
      console.warn(`Site server crashed: ${details}`, error);
    }
  });
  await server.start('app launch');
};
