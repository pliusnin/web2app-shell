export type PageError = { type: 'offline' } | { type: 'http'; status: number };

export type LoadErrorKind = 'ignored' | 'network' | 'other';

export type HttpErrorAction =
  'showErrorScreen' | 'abortToErrorScreen' | 'abortToCurrentPage';
