import { useEffect } from 'react';
import type { RefObject } from 'react';
import { DeviceEventEmitter } from 'react-native';

import {
  BIOMETRICS_CHANGED_EVENT,
  getBiometricsStateHelper,
  saveBiometricsEnabledHelper,
  switchBiometricsHelper,
} from '../../../../features/biometric-login';
import { callPageScriptHelper } from '../../../../shared/bridge';
import type { WebViewControls } from '../../../../shared/lib';

const sendState = (webView: RefObject<WebViewControls | null>) =>
  getBiometricsStateHelper()
    .then(state =>
      webView.current?.injectJavaScript(
        callPageScriptHelper({ fn: 'setState', args: [state] }),
      ),
    )
    .catch(console.warn);

/**
 * Handles biometric login commands from the page: turns it on or off after
 * the biometric prompt, turns it off on sign-out and keeps the page state up
 * to date, including after changes in other tabs.
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
    setEnabled: (isEnabled: boolean) =>
      switchBiometricsHelper(isEnabled).catch(console.warn),
    // Otherwise the next sign-in with a password would lock the next launch
    signOut: () => saveBiometricsEnabledHelper(false).catch(console.warn),
  };
};
