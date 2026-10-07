import type { PageLoadEvent, PageLoadState } from './page-load.types';

export const initialPageLoadState: PageLoadState = {
  isLoading: false,
  progress: 0,
  error: null,
  hasShownPage: false,
};

export const pageLoadReducer = (
  state: PageLoadState,
  event: PageLoadEvent,
): PageLoadState => {
  switch (event.type) {
    case 'loadStarted':
      return { ...state, isLoading: true, progress: 0 };
    case 'progressChanged':
      return { ...state, progress: event.progress };
    case 'loadFinished':
      // The WebView also sends onLoadEnd after a failed or stopped load
      if (!state.isLoading) {
        return state;
      }
      return { ...state, isLoading: false, error: null, hasShownPage: true };
    case 'loadFailed':
      return { ...state, isLoading: false, error: event.error };
    case 'loadStopped':
      return { ...state, isLoading: false };
  }
};
