import { useCallback, useEffect, useState } from 'react';

import { hideSplashHelper, waitForActiveAppHelper } from '../../../shared/lib';
import { isBiometricsEnabledHelper } from './is-biometrics-enabled.helper';
import { promptBiometricsHelper } from './prompt-biometrics.helper';

/**
 * Locks the app at a cold start while biometric login is on: the pages open
 * only after the biometric prompt. Returning from the background does not
 * lock it again.
 */
export const useLaunchLock = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const unlock = useCallback(() => {
    setIsChecking(true);
    waitForActiveAppHelper()
      .then(promptBiometricsHelper)
      .catch(() => false)
      .then(isVerified => {
        setIsUnlocked(isVerified);
        setIsLocked(!isVerified);
        setIsChecking(false);
        if (!isVerified) {
          // The pages, which hide the splash, are not shown
          hideSplashHelper();
        }
      });
  }, []);

  useEffect(() => {
    isBiometricsEnabledHelper()
      .catch(() => false)
      .then(isEnabled => (isEnabled ? unlock() : setIsUnlocked(true)));
  }, [unlock]);

  return {
    isUnlocked,
    isLocked,
    isChecking,
    unlock,
    open: () => {
      setIsLocked(false);
      setIsUnlocked(true);
    },
  };
};
