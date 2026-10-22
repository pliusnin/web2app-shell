import { useRef } from 'react';
import type { RefObject } from 'react';

import { callPageScriptHelper } from '../../../../shared/bridge';
import type { FetchRequest } from '../../../../shared/bridge';
import { useFetchInterceptors } from '../../../../shared/fetch-interceptors';
import type { WebViewControls } from '../../../../shared/lib';
import { nativeFetchHelper } from './native-fetch.helper';

/**
 * Performs the requests the page sends through the bridge and returns the
 * responses to it, through the host app's interceptors. The page can cancel
 * a request it is waiting for.
 */
export const useNativeFetch = (webView: RefObject<WebViewControls | null>) => {
  const requests = useRef(new Map<string, AbortController>());
  const interceptors = useFetchInterceptors();

  return {
    start: (request: FetchRequest) => {
      const controller = new AbortController();
      requests.current.set(request.callID, controller);
      nativeFetchHelper(request, controller.signal, interceptors).then(
        response => {
          requests.current.delete(request.callID);
          webView.current?.injectJavaScript(
            callPageScriptHelper({
              fn: 'reply',
              args: [request.callID, response],
            }),
          );
        },
      );
    },
    abort: (callID: string) => requests.current.get(callID)?.abort(),
  };
};
