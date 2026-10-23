import type { RefObject } from 'react';

import {
  readSensorHelper,
  verifyUserHelper,
} from '../../../../features/biometric-login';
import { isAppUrlHelper } from '../../../../features/link-routing';
import {
  clearSessionHelper,
  saveSessionTokenHelper,
} from '../../../../features/session';
import {
  callPageScriptHelper,
  parseBridgeMessageHelper,
} from '../../../../shared/bridge';
import { hideSplashHelper } from '../../../../shared/lib';
import type { MessageHandler, WebViewControls } from '../../../../shared/lib';
import { useBiometricLogin } from '../biometric-login/use-biometric-login';
import { openDownloadedFileHelper } from '../file-download/open-downloaded-file.helper';
import { showFileErrorToastHelper } from '../file-download/show-file-error-toast.helper';
import { useNativeFetch } from '../native-fetch/use-native-fetch';

/**
 * Returns the WebView onMessage handler for the commands sent by the bridge
 * file on the site.
 */
export const useBridgeMessages = (
  webView: RefObject<WebViewControls | null>,
): MessageHandler => {
  const nativeFetch = useNativeFetch(webView);
  const biometricLogin = useBiometricLogin(webView);

  const reply = (callID: string, value: boolean) =>
    webView.current?.injectJavaScript(
      callPageScriptHelper({ fn: 'reply', args: [callID, value] }),
    );

  return ({ nativeEvent }) => {
    // Any page or frame in the WebView can send messages. The app makes
    // requests without CORS and saves files only for pages of the site itself
    if (!isAppUrlHelper(nativeEvent.url)) {
      return;
    }
    const message = parseBridgeMessageHelper(nativeEvent.data);

    switch (message?.cmd) {
      case 'WEB_READY':
        // The site rendered its first screen. Tabs mount lazily, so at launch
        // the splash can only be hidden by the start tab
        hideSplashHelper();
        biometricLogin.sendState();
        break;
      case 'FETCH':
        nativeFetch.start(message.args);
        break;
      case 'ABORT_CALL':
        nativeFetch.abort(message.args.callID);
        break;
      case 'DOWNLOAD_FILE':
        openDownloadedFileHelper(message.args).catch(error => {
          console.warn(error);
          showFileErrorToastHelper();
        });
        break;
      case 'SAVE_TOKEN':
        saveSessionTokenHelper(message.args.token).catch(console.warn);
        break;
      case 'LOGGED_OUT':
        biometricLogin.signOut();
        clearSessionHelper().catch(console.warn);
        break;
      case 'BIOMETRICS_ON':
      case 'BIOMETRICS_OFF':
        biometricLogin.setEnabled(message.cmd === 'BIOMETRICS_ON');
        break;
      // The bridge's verifyUser(): biometric prompt
      case 'VERIFY_USER':
        verifyUserHelper()
          .catch(() => false)
          .then(isVerified => reply(message.args.callID, isVerified));
        break;
      case 'IS_BIOMETRICS_AVAILABLE':
        readSensorHelper().then(({ available }) =>
          reply(message.args.callID, available),
        );
        break;
    }
  };
};
