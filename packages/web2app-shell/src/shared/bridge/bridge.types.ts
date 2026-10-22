export type FetchRequest = {
  callID: string;
  url: string;
  options: {
    method: string;
    headers: Record<string, string>;
    credentials: 'include' | 'omit';
    // Body bytes as the browser encoded them, in base64
    body?: string;
  };
};

export type FetchResponse =
  | {
      resolve: true;
      status: number;
      statusText: string;
      url: string;
      headers: Record<string, string>;
      // Body bytes in base64
      body: string;
    }
  | {
      resolve: false;
      // Error text
      body: string;
    };

export type DownloadedFile = {
  fileName: string;
  // A base64 data: URL or an http(s) URL
  url: string;
};

export type BiometricsState = {
  isFingerprintAvailable: boolean;
  isFaceIdAvailable: boolean;
  isFingerprintEnabled: boolean;
};

export type BridgeMessage =
  | { cmd: 'WEB_READY' }
  | { cmd: 'FETCH'; args: FetchRequest }
  | { cmd: 'ABORT_CALL'; args: { callID: string } }
  | { cmd: 'DOWNLOAD_FILE'; args: DownloadedFile }
  | { cmd: 'SAVE_TOKEN'; args: { token: string } }
  | { cmd: 'LOGGED_OUT' }
  | { cmd: 'BIOMETRICS_ON' }
  | { cmd: 'BIOMETRICS_OFF' }
  | { cmd: 'VERIFY_USER'; args: { callID: string } }
  | { cmd: 'IS_BIOMETRICS_AVAILABLE'; args: { callID: string } };

export type AppCommand = { cmd: 'CHANGE_LOCATION'; args: { url: string } };

// Functions window.__MG_Native_<fn> that the app calls on the page
export type PageCall =
  | { fn: 'invoke'; args: [command: AppCommand] }
  | { fn: 'reply'; args: [callID: string, value: unknown] }
  | { fn: 'setState'; args: [state: BiometricsState] };
