import type { RefObject } from 'react';

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
import { readSensorHelper } from '../biometric-login/read-sensor.helper';
import { useBiometricLogin } from '../biometric-login/use-biometric-login';
import { verifyUserHelper } from '../biometric-login/verify-user.helper';
import { openDownloadedFileHelper } from '../file-download/open-downloaded-file.helper';
import { showFileErrorToastHelper } from '../file-download/show-file-error-toast.helper';
import { useNativeFetch } from '../native-fetch/use-native-fetch';

/**
 * Возвращает обработчик onMessage WebView для команд, которые присылает
 * скрипт моста на сайте.
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
    // Сообщения может прислать любая страница или фрейм в WebView. Запросы без
    // CORS и сохранение файлов приложение делает только для страниц самого сайта
    if (!isAppUrlHelper(nativeEvent.url)) {
      return;
    }
    const message = parseBridgeMessageHelper(nativeEvent.data);

    switch (message?.cmd) {
      case 'WEB_READY':
        // Сайт отрисовал первый экран. Табы монтируются лениво, поэтому при
        // запуске сплэш может скрыть только стартовый таб
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
      case 'LOGGED_IN':
        biometricLogin.signIn(message.args.user);
        break;
      case 'LOGGED_OUT':
        biometricLogin.signOut();
        clearSessionHelper().catch(console.warn);
        break;
      case 'BIOMETRICS_ON':
      case 'BIOMETRICS_OFF':
        biometricLogin.setEnabled(message.cmd === 'BIOMETRICS_ON');
        break;
      case 'LOGIN_WITH_BIOMETRICS':
        biometricLogin.login();
        break;
      // WebAuthn сайта, на который отвечает биометрический промпт
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
