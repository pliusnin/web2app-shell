// window.__MG_Native и обмен сообщениями, которым пользуются остальные части
// скрипта. Имена сохраняют контракт, на который уже опираются сайты
export const CORE_SCRIPT = `
  const post = message => {
    window.ReactNativeWebView.postMessage(JSON.stringify(message));
  };

  // FileReader отдаёт data URL, base64 — часть после запятой
  const readAsBase64 = blob =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });

  // Добавляет слушателя, возвращённая функция его удаляет
  const subscribe = listeners => callback => {
    listeners.add(callback);
    return () => listeners.delete(callback);
  };

  const stateListeners = new Set();
  const eventListeners = new Set();
  // Команды приложения, которые скрипт обрабатывает сам, остальные получает сайт
  const commandHandlers = {};

  const bridge = {
    isNative: true,
    // Настоящее состояние приложение присылает, когда страница готова
    state: {
      isFingerprintAvailable: false,
      isFaceIdAvailable: false,
      isFingerprintEnabled: false,
    },
    onUpdate: subscribe(stateListeners),
    onNativeEvent: subscribe(eventListeners),
  };
  window.__MG_Native = bridge;

  window.__MG_Native_setState = state => {
    bridge.state = state;
    stateListeners.forEach(callback => callback(state));
  };

  // ID разные у каждой загрузки страницы: ответ для ушедшей страницы не
  // попадёт в вызов страницы, загруженной после неё
  const pageID = Math.random().toString(36).slice(2);
  const calls = new Map();
  let callCount = 0;

  // Отправляет команду приложению и резолвится его ответом. Отмена signal
  // отклоняет вызов и сообщает приложению через ABORT_CALL
  const callApp = (cmd, args, signal) =>
    new Promise((resolve, reject) => {
      if (signal && signal.aborted) {
        reject(signal.reason);
        return;
      }
      callCount += 1;
      const callID = pageID + '_' + callCount;
      const onAbort = () => {
        calls.delete(callID);
        post({ cmd: 'ABORT_CALL', args: { callID } });
        reject(signal.reason);
      };
      calls.set(callID, value => {
        if (signal) {
          signal.removeEventListener('abort', onAbort);
        }
        resolve(value);
      });
      if (signal) {
        signal.addEventListener('abort', onAbort);
      }
      post({ cmd, args: { ...args, callID } });
    });

  window.__MG_Native_reply = (callID, value) => {
    const resolve = calls.get(callID);
    calls.delete(callID);
    if (resolve) {
      resolve(value);
    }
  };

  window.__MG_Native_invoke = event => {
    const handler = commandHandlers[event.cmd];
    if (handler) {
      handler(event.args);
      return;
    }
    eventListeners.forEach(callback => callback(event));
  };
`;
