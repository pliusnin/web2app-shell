import type { PageError } from './page-load-error.types';

export type PageLoadState = {
  isLoading: boolean;
  progress: number;
  error: PageError | null;
  hasShownPage: boolean;
};

export type PageLoadEvent =
  | { type: 'loadStarted' }
  | { type: 'progressChanged'; progress: number }
  | { type: 'loadFinished' }
  | { type: 'loadFailed'; error: PageError }
  | { type: 'loadStopped' };
