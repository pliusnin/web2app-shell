import { BIOMETRICS_SCRIPT } from './script/biometrics.script';
import { CORE_SCRIPT } from './script/core.script';
import { FETCH_SCRIPT } from './script/fetch.script';

// window.__MG_Native for the site's bridge file. The WebView runs it before the
// page scripts. The parts share one scope: later ones use what earlier ones
// declare. The trailing true is for react-native-webview: without a value
// the script sometimes silently fails to run
export const BRIDGE_SCRIPT = `(function () {
${CORE_SCRIPT}
${FETCH_SCRIPT}
${BIOMETRICS_SCRIPT}
})();
true;
`;
