import { useReducer } from 'react';
import type { RefObject } from 'react';

import type {
  ErrorHandler,
  HttpErrorHandler,
  LoadProgressHandler,
  WebViewControls,
} from '../types';
import {
  classifyLoadError,
  initialPageLoadState,
  pageLoadReducer,
  resolveHttpError,
  showServerErrorToast,
} from '../utils';
import { useNetworkChange } from './use-network-change';

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
    const kind = classifyLoadError(event.nativeEvent);
    if (kind === 'other') {
      return;
    }
    event.preventDefault();
    if (kind === 'network') {
      dispatch({ type: 'loadFailed', error: { type: 'offline' } });
    }
  };

  const onHttpError: HttpErrorHandler = ({ nativeEvent: { statusCode } }) => {
    const { showToast, stopLoading, showScreen } = resolveHttpError(
      statusCode,
      state.hasShownPage,
    );
    if (showToast) {
      showServerErrorToast();
    }
    if (stopLoading) {
      webView.current?.stopLoading();
    }
    dispatch(
      showScreen
        ? { type: 'loadFailed', error: { type: 'http', status: statusCode } }
        : { type: 'loadStopped' },
    );
  };

  const onLoadProgress: LoadProgressHandler = ({ nativeEvent }) => {
    dispatch({ type: 'progress', progress: nativeEvent.progress });
  };

  return {
    isLoading: state.isLoading,
    progress: state.progress,
    error: state.error,
    retry,
    webViewHandlers: {
      onError,
      onHttpError,
      onLoadStart: () => dispatch({ type: 'loadStart' }),
      onLoadProgress,
      onLoadEnd: () => dispatch({ type: 'loadEnd' }),
    },
  };
};
