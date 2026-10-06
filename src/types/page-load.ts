export type PageError = { type: 'offline' } | { type: 'http'; status: number };

export type PageLoadState = {
  isLoading: boolean;
  progress: number;
  error: PageError | null;
  hasShownPage: boolean;
};

export type PageLoadEvent =
  | { type: 'loadStart' }
  | { type: 'progress'; progress: number }
  | { type: 'loadEnd' }
  | { type: 'loadFailed'; error: PageError }
  | { type: 'loadStopped' };

export type HttpErrorResolution = {
  showToast: boolean;
  stopLoading: boolean;
  showScreen: boolean;
};
