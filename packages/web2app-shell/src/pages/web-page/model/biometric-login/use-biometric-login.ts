import { useEffect } from 'react';
import type { RefObject } from 'react';
import { DeviceEventEmitter } from 'react-native';

import { callPageScriptHelper } from '../../../../shared/bridge';
import type { SignedInUser } from '../../../../shared/bridge';
import type { WebViewControls } from '../../../../shared/lib';
import { BIOMETRICS_CHANGED_EVENT } from '../../config/biometric-login';
import type { BiometricLogin } from './biometric-login.types';
import { confirmBiometricLoginHelper } from './confirm-biometric-login.helper';
import { getBiometricsStateHelper } from './get-biometrics-state.helper';
import { isSameUserHelper } from './is-same-user.helper';
import { updateBiometricLoginHelper } from './update-biometric-login.helper';

const sendState = (webView: RefObject<WebViewControls | null>) =>
  getBiometricsStateHelper()
    .then(state =>
      webView.current?.injectJavaScript(
        callPageScriptHelper({ fn: 'setState', args: [state] }),
      ),
    )
    .catch(console.warn);

const change = (update: (stored: BiometricLogin) => BiometricLogin) =>
  updateBiometricLoginHelper(update).catch(console.warn);

/**
 * Обрабатывает команды биометрического входа от страницы: запоминает, кто
 * вошёл и кто включил биометрический вход, выполняет вход после
 * биометрического промпта и держит состояние страницы актуальным, в том числе
 * после изменений в других табах.
 */
export const useBiometricLogin = (
  webView: RefObject<WebViewControls | null>,
) => {
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      BIOMETRICS_CHANGED_EVENT,
      () => sendState(webView),
    );
    return () => subscription.remove();
  }, [webView]);

  return {
    sendState: () => sendState(webView),
    // Сайт присылает свою форму входа, из неё хранятся только логин и пароль
    signIn: ({ login, password }: SignedInUser) =>
      change(({ biometricsUser }) => {
        const user = { login, password };
        return {
          user,
          // Пароль мог смениться после включения биометрического входаD
          biometricsUser:
            biometricsUser && isSameUserHelper(biometricsUser, user)
              ? user
              : biometricsUser,
        };
      }),
    // Биометрический вход остаётся включённым для следующего входа
    signOut: () => change(stored => ({ ...stored, user: null })),
    setEnabled: (isEnabled: boolean) =>
      change(stored => ({
        ...stored,
        biometricsUser: isEnabled ? stored.user : null,
      })),
    login: () =>
      confirmBiometricLoginHelper()
        .then(user => {
          if (user) {
            webView.current?.injectJavaScript(
              callPageScriptHelper({
                fn: 'invoke',
                args: [
                  {
                    cmd: 'LOGIN',
                    args: { email: user.login, password: user.password },
                  },
                ],
              }),
            );
          }
        })
        .catch(console.warn),
  };
};
