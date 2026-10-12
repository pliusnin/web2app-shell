import { Platform } from 'react-native';
import type { NativeSyntheticEvent } from 'react-native';
import { act, renderHook } from '@testing-library/react-native';
import { NetInfoStateType, useNetInfo } from '@react-native-community/netinfo';
import type { NetInfoState } from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';

import { TEXTS } from '../../../../shared/config';
import { usePageLoad } from './use-page-load';

const ONLINE: NetInfoState = {
  type: NetInfoStateType.other,
  isConnected: true,
  isInternetReachable: true,
  details: { isConnectionExpensive: false },
};

const OFFLINE: NetInfoState = {
  type: NetInfoStateType.none,
  isConnected: false,
  isInternetReachable: false,
  details: null,
};

const PAGE = {
  url: 'https://example.com/',
  title: '',
  loading: false,
  canGoBack: false,
  canGoForward: false,
  lockIdentifier: 0,
};

const createEvent = <T>(nativeEvent: T): NativeSyntheticEvent<T> => ({
  nativeEvent,
  preventDefault: jest.fn(),
  isDefaultPrevented: () => false,
  stopPropagation: jest.fn(),
  isPropagationStopped: () => false,
  persist: jest.fn(),
  bubbles: false,
  cancelable: true,
  currentTarget: 0,
  target: 0,
  defaultPrevented: false,
  dispatchConfig: { registrationName: '' },
  eventPhase: 0,
  isTrusted: true,
  timeStamp: 0,
  type: '',
});

const createLoadError = (code: number, domain?: string) =>
  createEvent({ ...PAGE, code, domain, description: '' });

const createHttpError = (statusCode: number) =>
  createEvent({ ...PAGE, statusCode, description: '' });

const netInfo = jest.mocked(useNetInfo);

const renderPageLoad = async (network: NetInfoState = ONLINE) => {
  netInfo.mockReturnValue(network);
  const webView = {
    current: {
      reload: jest.fn(),
      stopLoading: jest.fn(),
      goBack: jest.fn(),
      injectJavaScript: jest.fn(),
    },
  };
  const hook = await renderHook(() => usePageLoad(webView));

  return { ...hook, webView: webView.current };
};

const changeNetwork = async (
  rerender: (props: unknown) => Promise<void>,
  network: NetInfoState,
) => {
  netInfo.mockReturnValue(network);
  await rerender(undefined);
};

describe('usePageLoad', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('is not settled before anything is on screen', async () => {
    const { result } = await renderPageLoad();

    expect(result.current).toMatchObject({
      isLoading: false,
      isSettled: false,
      error: null,
    });
  });

  it('shows the progress while the page loads', async () => {
    const { result } = await renderPageLoad();

    await act(() => result.current.webViewHandlers.onLoadStart());
    expect(result.current).toMatchObject({ isLoading: true, progress: 0 });

    await act(() =>
      result.current.webViewHandlers.onLoadProgress(
        createEvent({ ...PAGE, progress: 0.5 }),
      ),
    );
    expect(result.current.progress).toBe(0.5);
  });

  it('settles once the page has loaded', async () => {
    const { result } = await renderPageLoad();

    await act(() => result.current.webViewHandlers.onLoadStart());
    await act(() => result.current.webViewHandlers.onLoadEnd());

    expect(result.current).toMatchObject({
      isLoading: false,
      isSettled: true,
      error: null,
    });
  });

  it('shows the offline error instead of the WebView error page', async () => {
    const { result } = await renderPageLoad();
    const event = createLoadError(-1009, 'NSURLErrorDomain');

    await act(() => result.current.webViewHandlers.onLoadStart());
    await act(() => result.current.webViewHandlers.onError(event));

    expect(event.preventDefault).toHaveBeenCalled();
    expect(result.current).toMatchObject({
      isLoading: false,
      isSettled: true,
      error: { type: 'offline' },
    });
  });

  it('reloads by itself when the connection is back after an offline error', async () => {
    const { result, rerender, webView } = await renderPageLoad(OFFLINE);

    await act(() =>
      result.current.webViewHandlers.onError(
        createLoadError(-1009, 'NSURLErrorDomain'),
      ),
    );
    await changeNetwork(rerender, ONLINE);

    expect(webView.reload).toHaveBeenCalledTimes(1);
  });

  it('does not reload when the connection is back without an offline error', async () => {
    const { rerender, webView } = await renderPageLoad(OFFLINE);

    await changeNetwork(rerender, ONLINE);

    expect(webView.reload).not.toHaveBeenCalled();
  });

  it('ignores the Android error for app links that opened outside', async () => {
    jest.replaceProperty(Platform, 'OS', 'android');
    const { result } = await renderPageLoad();
    const event = createLoadError(-10);

    await act(() => result.current.webViewHandlers.onError(event));

    expect(event.preventDefault).toHaveBeenCalled();
    expect(result.current.error).toBeNull();
  });

  it('leaves other load errors to the WebView', async () => {
    const { result } = await renderPageLoad();
    const event = createLoadError(-999, 'NSURLErrorDomain');

    await act(() => result.current.webViewHandlers.onError(event));

    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(result.current.error).toBeNull();
  });

  it('shows the error screen for an HTTP error below 500', async () => {
    const { result, webView } = await renderPageLoad();

    await act(() => result.current.webViewHandlers.onLoadStart());
    await act(() =>
      result.current.webViewHandlers.onHttpError(createHttpError(404)),
    );

    expect(result.current.error).toEqual({ type: 'http', status: 404 });
    expect(webView.stopLoading).not.toHaveBeenCalled();
    expect(Toast.show).not.toHaveBeenCalled();
  });

  it('stops a 5xx load before any page with a toast and the error screen', async () => {
    const { result, webView } = await renderPageLoad();

    await act(() => result.current.webViewHandlers.onLoadStart());
    await act(() =>
      result.current.webViewHandlers.onHttpError(createHttpError(500)),
    );

    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({ text1: TEXTS.serverErrorTitle }),
    );
    expect(webView.stopLoading).toHaveBeenCalled();
    expect(result.current).toMatchObject({
      isLoading: false,
      error: { type: 'http', status: 500 },
    });
  });

  it('stops a 5xx load after a page was shown and keeps that page', async () => {
    const { result, webView } = await renderPageLoad();

    await act(() => result.current.webViewHandlers.onLoadStart());
    await act(() => result.current.webViewHandlers.onLoadEnd());
    await act(() => result.current.webViewHandlers.onLoadStart());
    await act(() =>
      result.current.webViewHandlers.onHttpError(createHttpError(500)),
    );

    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({ text1: TEXTS.serverErrorTitle }),
    );
    expect(webView.stopLoading).toHaveBeenCalled();
    expect(result.current).toMatchObject({ isLoading: false, error: null });
  });

  it('reloads the WebView on retry', async () => {
    const { result, webView } = await renderPageLoad();

    result.current.retry();

    expect(webView.reload).toHaveBeenCalledTimes(1);
  });
});
