import { useReducer } from 'react';
import type { RefObject } from 'react';

import { useNetworkChange } from '../../../../shared/lib';
import type {
  ErrorHandler,
  HttpErrorHandler,
  LoadProgressHandler,
  WebViewControls,
} from '../../../../shared/lib';
import { classifyLoadErrorHelper } from './classify-load-error.helper';
import { initialPageLoadState, pageLoadReducer } from './page-load-reducer';
import { getHttpErrorActionHelper } from './get-http-error-action.helper';
import { showServerErrorToastHelper } from './show-server-error-toast.helper';

/**
 * Tracks the WebView page load and returns the WebView handlers along with
 * progress, loading state, page error and retry. After an offline error the
 * page reloads by itself once the connection is back. isSettled turns true
 * when the page or an error screen is on screen.
 */
export const usePageLoad = (webView: RefObject<WebViewControls | null>) => {
  const [state, dispatch] = useReducer(pageLoadReducer, initialPageLoadState);
  const retry = () => webView.current?.reload();

  useNetworkChange({
    onOnline: () => {
      if (state.error?.type === 'offline') {
        retry();
      }
    },
  });

  const onError: ErrorHandler = event => {
    switch (classifyLoadErrorHelper(event.nativeEvent)) {
      case 'network':
        event.preventDefault();
        dispatch({ type: 'loadFailed', error: { type: 'offline' } });
        break;
      case 'ignored':
        event.preventDefault();
        break;
      case 'other':
        break;
    }
  };

  const abortLoad = () => {
    showServerErrorToastHelper();
    webView.current?.stopLoading();
  };

  const onHttpError: HttpErrorHandler = ({ nativeEvent: { statusCode } }) => {
    const httpError = { type: 'http', status: statusCode } as const;

    switch (getHttpErrorActionHelper(statusCode, state.hasShownPage)) {
      case 'showErrorScreen':
        dispatch({ type: 'loadFailed', error: httpError });
        break;
      case 'abortToErrorScreen':
        abortLoad();
        dispatch({ type: 'loadFailed', error: httpError });
        break;
      case 'abortToCurrentPage':
        abortLoad();
        dispatch({ type: 'loadStopped' });
        break;
    }
  };

  const onLoadProgress: LoadProgressHandler = ({ nativeEvent }) => {
    dispatch({ type: 'progressChanged', progress: nativeEvent.progress });
  };

  return {
    isLoading: state.isLoading,
    progress: state.progress,
    error: state.error,
    isSettled: state.hasShownPage || state.error !== null,
    retry,
    webViewHandlers: {
      onError,
      onHttpError,
      onLoadStart: () => dispatch({ type: 'loadStarted' }),
      onLoadProgress,
      onLoadEnd: () => dispatch({ type: 'loadFinished' }),
    },
  };
};
