import { initialPageLoadState, pageLoadReducer } from './page-load-reducer';
import type { PageLoadEvent } from './page-load.types';

const OFFLINE_ERROR = { type: 'offline' } as const;

const reduce = (...events: Array<PageLoadEvent>) =>
  events.reduce(pageLoadReducer, initialPageLoadState);

describe('pageLoadReducer', () => {
  it('starts with nothing loaded', () => {
    expect(initialPageLoadState).toEqual({
      isLoading: false,
      progress: 0,
      error: null,
      hasShownPage: false,
    });
  });

  it('starts loading from zero progress', () => {
    const state = reduce(
      { type: 'loadStarted' },
      { type: 'progressChanged', progress: 0.7 },
      { type: 'loadFinished' },
      { type: 'loadStarted' },
    );

    expect(state).toMatchObject({ isLoading: true, progress: 0 });
  });

  it('tracks the load progress', () => {
    const state = reduce(
      { type: 'loadStarted' },
      { type: 'progressChanged', progress: 0.4 },
    );

    expect(state.progress).toBe(0.4);
  });

  it('marks the page as shown when the load finishes', () => {
    const state = reduce({ type: 'loadStarted' }, { type: 'loadFinished' });

    expect(state).toMatchObject({ isLoading: false, hasShownPage: true });
  });

  it('keeps the error until the next load finishes', () => {
    const failed = reduce(
      { type: 'loadStarted' },
      { type: 'loadFailed', error: OFFLINE_ERROR },
    );
    const retrying = pageLoadReducer(failed, { type: 'loadStarted' });
    const reloaded = pageLoadReducer(retrying, { type: 'loadFinished' });

    expect(failed).toMatchObject({ isLoading: false, error: OFFLINE_ERROR });
    expect(retrying.error).toEqual(OFFLINE_ERROR);
    expect(reloaded).toMatchObject({ error: null, hasShownPage: true });
  });

  it('ignores the load end the WebView sends after a failed load', () => {
    const failed = reduce(
      { type: 'loadStarted' },
      { type: 'loadFailed', error: OFFLINE_ERROR },
    );

    expect(pageLoadReducer(failed, { type: 'loadFinished' })).toBe(failed);
  });

  it('ignores the load end the WebView sends after a stopped load', () => {
    const stopped = reduce({ type: 'loadStarted' }, { type: 'loadStopped' });

    expect(pageLoadReducer(stopped, { type: 'loadFinished' })).toBe(stopped);
  });

  it('keeps the shown page when a load is stopped', () => {
    const state = reduce(
      { type: 'loadStarted' },
      { type: 'loadFinished' },
      { type: 'loadStarted' },
      { type: 'loadStopped' },
    );

    expect(state).toMatchObject({
      isLoading: false,
      error: null,
      hasShownPage: true,
    });
  });
});
