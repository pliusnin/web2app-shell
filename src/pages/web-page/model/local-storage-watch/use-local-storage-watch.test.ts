import { renderHook } from '@testing-library/react-native';
import type { WebViewMessageEvent } from 'react-native-webview';

import { useLocalStorageWatch } from './use-local-storage-watch';

const PAGE_URI = 'https://app.example.com/orders';

const messageEvent = (url: string, hasValue: boolean) =>
  ({
    nativeEvent: {
      url,
      data: JSON.stringify({ cmd: 'LOCAL_STORAGE_KEY', args: { hasValue } }),
    },
  }) as WebViewMessageEvent;

describe('useLocalStorageWatch', () => {
  it('adds nothing to the WebView without a key', async () => {
    const { result } = await renderHook(() =>
      useLocalStorageWatch(PAGE_URI, undefined, jest.fn()),
    );

    expect(result.current).toEqual({});
  });

  it('injects the watch script before and after the page loads', async () => {
    const { result } = await renderHook(() =>
      useLocalStorageWatch(PAGE_URI, 'token', jest.fn()),
    );

    expect(result.current.injectedJavaScriptBeforeContentLoaded).toContain(
      '"token"',
    );
    expect(result.current.injectedJavaScript).toBe(
      result.current.injectedJavaScriptBeforeContentLoaded,
    );
  });

  it('passes on the reports of the site pages only', async () => {
    const onChange = jest.fn();
    const { result } = await renderHook(() =>
      useLocalStorageWatch(PAGE_URI, 'token', onChange),
    );

    result.current.onMessage?.(messageEvent('https://app.example.com/', true));
    result.current.onMessage?.(
      messageEvent('https://evil.example.net/', false),
    );

    expect(onChange.mock.calls).toEqual([[true]]);
  });
});
