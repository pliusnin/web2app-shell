// window.__MG_Native that the site's bridge file reads, and the messaging
// used by the other parts of the script
export const CORE_SCRIPT = `
  const post = message => {
    window.ReactNativeWebView.postMessage(JSON.stringify(message));
  };

  // Adds a listener, the returned function removes it
  const subscribe = listeners => callback => {
    listeners.add(callback);
    return () => listeners.delete(callback);
  };

  const stateListeners = new Set();
  const eventListeners = new Set();

  const bridge = {
    isNative: true,
    // The app sends the real state when the page is ready
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

  // IDs differ on every page load: a reply meant for a departed page will
  // not reach a call of the page loaded after it
  const pageID = Math.random().toString(36).slice(2);
  const calls = new Map();
  let callCount = 0;

  // Sends a command to the app and resolves with its reply. Aborting the
  // signal rejects the call and tells the app via ABORT_CALL
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
    eventListeners.forEach(callback => callback(event));
  };
`;
