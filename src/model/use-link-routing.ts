import { useMemo } from 'react';

import { useConfig } from '../config';
import { getTabHosts } from './get-tab-hosts';
import { openExternalUrl } from './open-external-url';
import { shouldLoadInApp } from './should-load-in-app';
import type { ShouldStartLoadHandler } from './types';

export const useLinkRouting = (): ShouldStartLoadHandler => {
  const { tabs } = useConfig();
  const appHosts = useMemo(() => getTabHosts(tabs), [tabs]);

  return request => {
    if (shouldLoadInApp(request, appHosts)) {
      return true;
    }
    // Android waits for the answer only 250 ms, so the URL is opened without waiting
    openExternalUrl(request.url);

    return false;
  };
};
