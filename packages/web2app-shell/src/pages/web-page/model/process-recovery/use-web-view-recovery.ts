import { useRef, useState } from 'react';

/**
 * Создаёт WebView заново, когда его процесс контента завершился (например,
 * из-за нехватки памяти): Android больше не может использовать этот WebView.
 * Новый открывает страницу, на которой был старый. Возвращает key и uri
 * для WebView.
 */
export const useWebViewRecovery = (uri: string) => {
  const lastUrl = useRef(uri);
  const [instance, setInstance] = useState({ key: 0, uri });

  const recreate = () =>
    setInstance(({ key }) => ({ key: key + 1, uri: lastUrl.current }));

  return {
    key: instance.key,
    uri: instance.uri,
    trackUrl: (url: string) => {
      lastUrl.current = url;
    },
    onContentProcessDidTerminate: recreate,
    onRenderProcessGone: recreate,
  };
};
