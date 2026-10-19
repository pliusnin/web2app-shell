export type FetchRequest = {
  callID: string;
  url: string;
  options: {
    method: string;
    headers: Record<string, string>;
    credentials: 'include' | 'omit';
    // Байты тела в том виде, как их закодировал браузер, в base64
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
      // Байты тела в base64
      body: string;
    }
  | {
      resolve: false;
      // Текст ошибки
      body: string;
    };

export type DownloadedFile = {
  fileName: string;
  mimeType: string;
  base64: string;
};

export type SignedInUser = {
  login: string;
  password: string;
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
  | { cmd: 'LOGGED_IN'; args: { user: SignedInUser } }
  | { cmd: 'LOGGED_OUT' }
  | { cmd: 'BIOMETRICS_ON' }
  | { cmd: 'BIOMETRICS_OFF' }
  | { cmd: 'LOGIN_WITH_BIOMETRICS' }
  | { cmd: 'VERIFY_USER'; args: { callID: string } }
  | { cmd: 'IS_BIOMETRICS_AVAILABLE'; args: { callID: string } };

export type AppCommand =
  | { cmd: 'LOGIN'; args: { email: string; password: string } }
  | { cmd: 'CHANGE_LOCATION'; args: { url: string } };

// Функции window.__MG_Native_<fn>, которые приложение вызывает на странице
export type PageCall =
  | { fn: 'invoke'; args: [command: AppCommand] }
  | { fn: 'reply'; args: [callID: string, value: unknown] }
  | { fn: 'setState'; args: [state: BiometricsState] };
