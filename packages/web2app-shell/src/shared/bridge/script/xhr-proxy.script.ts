// XMLHttpRequest (и axios) к другим origin идёт через приложение, как fetch:
// XHR открывается, но не отправляется, на него ставится результат приложения
export const XHR_PROXY_SCRIPT = `
  const XHR = XMLHttpRequest.prototype;
  const { open, setRequestHeader, send, abort } = XHR;
  const xhrRequests = new WeakMap();
  // Поля XHR, которые задаёт результат запроса через приложение
  const xhrResultFields = [
    'readyState',
    'status',
    'statusText',
    'responseURL',
    'response',
    'responseText',
    'responseXML',
    'getResponseHeader',
    'getAllResponseHeaders',
  ];

  // Декодирует по charset ответа, неизвестный считается UTF-8, как в XHR
  const decodeText = (buffer, contentType) => {
    const charset = /charset="?([^";]+)/i.exec(contentType || '');
    try {
      return new TextDecoder(charset ? charset[1] : undefined).decode(buffer);
    } catch {
      return new TextDecoder().decode(buffer);
    }
  };

  // XHR даёт документ только для HTML и XML, а для битого XML — null
  const parseDocument = (text, contentType) => {
    const type = (contentType || '').split(';')[0].trim().toLowerCase();
    if (type === 'text/html') {
      return new DOMParser().parseFromString(text, type);
    }
    const isXml = type === 'text/xml' || type === 'application/xml' || type.endsWith('+xml');
    if (!isXml) {
      return null;
    }
    const xml = new DOMParser().parseFromString(text, 'application/xml');
    return xml.getElementsByTagName('parsererror').length ? null : xml;
  };

  const readXhrResponse = async (response, responseType) => {
    switch (responseType) {
      case 'json':
        return response.json().catch(() => null);
      case 'blob':
        return response.blob();
      case 'arraybuffer':
        return response.arrayBuffer();
    }
    const contentType = response.headers.get('content-type');
    const text = decodeText(await response.arrayBuffer(), contentType);
    return responseType === 'document' ? parseDocument(text, contentType) : text;
  };

  const headersText = headers => {
    let text = '';
    headers.forEach((value, name) => {
      text += name + ': ' + value + '\\r\\n';
    });
    return text;
  };

  // XHR, открытый заново, бросил запрос: результата и событий он не получит
  const finishXhr = (xhr, state, result, events) => {
    if (xhrRequests.get(xhr) !== state) {
      return;
    }
    result.readyState = XMLHttpRequest.DONE;
    Object.keys(result).forEach(name => {
      Object.defineProperty(xhr, name, { value: result[name], configurable: true });
    });
    xhr.dispatchEvent(new Event('readystatechange'));
    events.forEach(type => xhr.dispatchEvent(new ProgressEvent(type)));
  };

  XHR.open = function (method, url, isAsync) {
    const previous = xhrRequests.get(this);
    if (previous && previous.abort) {
      previous.abort();
    }
    xhrResultFields.forEach(name => delete this[name]);
    xhrRequests.set(this, {
      method,
      url: new URL(url, location.href).href,
      // Синхронный запрос не может ждать приложение
      isAsync: isAsync !== false,
      headers: new Headers(),
    });
    return open.apply(this, arguments);
  };

  XHR.setRequestHeader = function (name, value) {
    const state = xhrRequests.get(this);
    if (state) {
      state.headers.append(name, value);
    }
    return setRequestHeader.apply(this, arguments);
  };

  XHR.send = function (body) {
    const xhr = this;
    const state = xhrRequests.get(xhr);
    if (!state || !state.isAsync || !isOtherOrigin(state.url)) {
      return send.apply(xhr, arguments);
    }

    const controller = new AbortController();
    let isTimedOut = false;
    const timer =
      xhr.timeout > 0 &&
      setTimeout(() => {
        isTimedOut = true;
        controller.abort();
      }, xhr.timeout);
    state.abort = () => controller.abort();

    // Приложение не сообщает прогресс отправки: всё тело считается
    // отправленным, как только передано приложению, поэтому
    // onUploadProgress (axios) всё равно срабатывает
    const sendUploadEvents = size => {
      ['loadstart', 'progress', 'load', 'loadend'].forEach(type => {
        xhr.upload.dispatchEvent(
          new ProgressEvent(type, { lengthComputable: true, loaded: size, total: size }),
        );
      });
    };

    const request = async () => {
      const response = await sendThroughApp(
        new Request(state.url, {
          method: state.method,
          headers: state.headers,
          // XHR игнорирует тело GET и HEAD, а Request его отклоняет
          body: /^(GET|HEAD)$/i.test(state.method) ? null : body,
          credentials: xhr.withCredentials ? 'include' : 'omit',
          signal: controller.signal,
        }),
        sendUploadEvents,
      );
      const value = await readXhrResponse(response, xhr.responseType);
      return {
        status: response.status,
        statusText: response.statusText,
        responseURL: response.url,
        response: value,
        getResponseHeader: name => response.headers.get(name),
        getAllResponseHeaders: () => headersText(response.headers),
        ...(typeof value === 'string' && { responseText: value }),
        ...(xhr.responseType === 'document' && { responseXML: value }),
      };
    };

    xhr.dispatchEvent(new ProgressEvent('loadstart'));
    request()
      .then(
        result => finishXhr(xhr, state, result, ['load', 'loadend']),
        () => {
          const failure = !controller.signal.aborted
            ? 'error'
            : isTimedOut
              ? 'timeout'
              : 'abort';
          finishXhr(xhr, state, { status: 0 }, [failure, 'loadend']);
        },
      )
      .finally(() => {
        clearTimeout(timer);
        delete state.abort;
      });
  };

  XHR.abort = function () {
    const state = xhrRequests.get(this);
    return state && state.abort ? state.abort() : abort.apply(this, arguments);
  };
`;
