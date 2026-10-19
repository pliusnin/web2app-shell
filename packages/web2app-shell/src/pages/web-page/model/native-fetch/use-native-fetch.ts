import { useRef } from 'react';
import type { RefObject } from 'react';

import { callPageScriptHelper } from '../../../../shared/bridge';
import type { FetchRequest } from '../../../../shared/bridge';
import type { WebViewControls } from '../../../../shared/lib';
import { nativeFetchHelper } from './native-fetch.helper';

/**
 * Выполняет запросы, которые страница отправляет через мост, и возвращает ей
 * ответы. Страница может отменить запрос, которого ждёт.
 */
export const useNativeFetch = (webView: RefObject<WebViewControls | null>) => {
  const requests = useRef(new Map<string, AbortController>());

  return {
    start: (request: FetchRequest) => {
      const controller = new AbortController();
      requests.current.set(request.callID, controller);
      nativeFetchHelper(request, controller.signal).then(response => {
        requests.current.delete(request.callID);
        webView.current?.injectJavaScript(
          callPageScriptHelper({
            fn: 'reply',
            args: [request.callID, response],
          }),
        );
      });
    },
    abort: (callID: string) => requests.current.get(callID)?.abort(),
  };
};
