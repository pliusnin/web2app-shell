import { renderHook } from '@testing-library/react-native';
import BootSplash from 'react-native-bootsplash';

import { useSplashHide } from './use-splash-hide';

describe('useSplashHide', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('keeps the splash while the page is loading', async () => {
    await renderHook(useSplashHide);

    expect(BootSplash.hide).not.toHaveBeenCalled();
  });

  it('hides the splash when the page has finished loading', async () => {
    const { result } = await renderHook(useSplashHide);

    result.current.onLoadEnd();

    expect(BootSplash.hide).toHaveBeenCalledWith({ fade: true });
  });

  it('hides the splash when the page takes too long to load', async () => {
    await renderHook(useSplashHide);

    jest.advanceTimersByTime(8000);

    expect(BootSplash.hide).toHaveBeenCalledTimes(1);
  });

  it('leaves the splash alone after the page is gone', async () => {
    const { unmount } = await renderHook(useSplashHide);

    await unmount();
    jest.advanceTimersByTime(8000);

    expect(BootSplash.hide).not.toHaveBeenCalled();
  });
});
