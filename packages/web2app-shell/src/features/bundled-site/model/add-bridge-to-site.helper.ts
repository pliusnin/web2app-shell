import ReactNativeBlobUtil from 'react-native-blob-util';

import { BRIDGE_SCRIPT } from '../../../shared/bridge';
import { BRIDGE_FILE_NAME, SITE_DIR } from '../config/bundled-site';

const BRIDGE_TAG = `<script src="/${BRIDGE_FILE_NAME}"></script>`;

/**
 * Кладёт скрипт моста рядом с сайтом и подключает его первым в index.html,
 * чтобы на обеих платформах он выполнялся раньше скриптов сайта. Файл
 * перезаписывается при каждом запуске: обновление приложения может принести
 * новый мост.
 */
export const addBridgeToSiteHelper = async () => {
  const { fs } = ReactNativeBlobUtil;
  const indexPath = `${SITE_DIR}/index.html`;

  await fs.writeFile(`${SITE_DIR}/${BRIDGE_FILE_NAME}`, BRIDGE_SCRIPT, 'utf8');
  const html: string = await fs.readFile(indexPath, 'utf8');
  if (!html.includes(BRIDGE_TAG)) {
    await fs.writeFile(
      indexPath,
      html.replace(/<head[^>]*>/i, head => head + BRIDGE_TAG),
      'utf8',
    );
  }
};
