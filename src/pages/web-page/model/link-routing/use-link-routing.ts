import { useMemo } from 'react';

import { useConfig } from '../../../../shared/config';
import type { ShouldStartLoadHandler } from '../../../../shared/lib';
import { getTabHostsHelper } from './get-tab-hosts.helper';
import { openExternalUrlHelper } from './open-external-url.helper';
import { shouldLoadInAppHelper } from './should-load-in-app.helper';

export const useLinkRouting = (): ShouldStartLoadHandler => {
  const { tabs } = useConfig();
  const appHosts = useMemo(() => getTabHostsHelper(tabs), [tabs]);

  return request => {
    if (shouldLoadInAppHelper(request, appHosts)) {
      return true;
    }
    // Android waits for the answer only 250 ms, so the URL is opened without waiting
    openExternalUrlHelper(request.url);

    return false;
  };
};
