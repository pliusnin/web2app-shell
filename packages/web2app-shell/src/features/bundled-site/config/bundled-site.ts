import ReactNativeBlobUtil from 'react-native-blob-util';

// Один каталог: в него распаковываем и из него же раздаём
export const SITE_DIR = `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/www/app`;
// В Android assets и в main bundle iOS
export const SITE_ZIP_NAME = 'webapp.zip';
export const BRIDGE_FILE_NAME = 'native-bridge.js';
