// Запросы на другие origin идут через приложение: их серверы не отдают сайту
// CORS-заголовки. Сайт получает ответ так, будто сделал запрос сам
export const FETCH_PROXY_SCRIPT = `
  const pageFetch = window.fetch.bind(window);

  const isOtherOrigin = url => {
    const { protocol, origin } = new URL(url, location.href);
    return /^https?:$/.test(protocol) && origin !== location.origin;
  };

  const toBytes = base64 =>
    Uint8Array.from(atob(base64), char => char.charCodeAt(0));

  // Как сам fetch: неудачный запрос — TypeError, HTTP-ошибка — ответ со своим
  // статусом
  const toResponse = result => {
    if (!result.resolve) {
      throw new TypeError('Network request failed: ' + result.body);
    }
    const response = new Response(result.body ? toBytes(result.body) : null, {
      status: result.status,
      statusText: result.statusText,
      headers: result.headers,
    });
    // У созданного здесь Response нет url, а сайт может читать, куда его перенаправили
    Object.defineProperty(response, 'url', { value: result.url });
    return response;
  };

  // Браузер уже закодировал тело (форму с boundary, файл) и выставил его
  // Content-Type, приложение отправляет эти байты и заголовки как есть.
  // onBodySent получает размер тела, когда тело передано приложению
  const sendThroughApp = async (request, onBodySent) => {
    const body = await request.blob();
    if (onBodySent && body.size) {
      onBodySent(body.size);
    }
    const result = await callApp(
      'FETCH',
      {
        url: request.url,
        options: {
          method: request.method,
          headers: Object.fromEntries(request.headers.entries()),
          // По умолчанию 'same-origin' не отправляет cookies на другие origin
          credentials: request.credentials === 'include' ? 'include' : 'omit',
          body: body.size ? await readAsBase64(body) : undefined,
        },
      },
      request.signal,
    );
    return toResponse(result);
  };

  // Для собственных запросов сайта Request не создаётся: он израсходовал бы
  // тело Request, который передал сайт
  window.fetch = async (input, init) => {
    const url = input instanceof Request ? input.url : String(input);
    return isOtherOrigin(url)
      ? sendThroughApp(new Request(input, init))
      : pageFetch(input, init);
  };

  bridge.fetch = async (input, init) => sendThroughApp(new Request(input, init));
`;
