import { CHANGE_LOCATION_SCRIPT } from './script/change-location.script';
import { CORE_SCRIPT } from './script/core.script';
import { FETCH_PROXY_SCRIPT } from './script/fetch-proxy.script';
import { FILE_DOWNLOAD_SCRIPT } from './script/file-download.script';
import { WEBAUTHN_SCRIPT } from './script/webauthn.script';
import { WEB_READY_SCRIPT } from './script/web-ready.script';
import { XHR_PROXY_SCRIPT } from './script/xhr-proxy.script';

// Мост, который index.html сайта загружает до своих скриптов. Части делят
// одну область видимости: последующие используют объявленное в предыдущих
export const BRIDGE_SCRIPT = `(function () {
${CORE_SCRIPT}
${FETCH_PROXY_SCRIPT}
${XHR_PROXY_SCRIPT}
${WEBAUTHN_SCRIPT}
${FILE_DOWNLOAD_SCRIPT}
${CHANGE_LOCATION_SCRIPT}
${WEB_READY_SCRIPT}
})();
`;
