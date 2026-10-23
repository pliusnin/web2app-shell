import { useEffect, useEffectEvent } from 'react';
import { AppState } from 'react-native';

import { updateSiteHelper } from './update-site.helper';

/**
 * Checks for a newer site archive at `updateUrl` on launch and on every return
 * to the foreground, downloading it in the background. The new version is served
 * on the next launch; the running WebViews keep the current one. A no-op without
 * `updateUrl`; repeated checks are throttled inside the manager.
 */
export const useSiteUpdate = (updateUrl?: string) => {
  const check = useEffectEvent(() => {
    if (updateUrl === undefined) {
      return;
    }
    updateSiteHelper(updateUrl).catch(console.warn);
  });

  useEffect(() => {
    check();
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        check();
      }
    });
    return () => subscription.remove();
  }, []);
};
