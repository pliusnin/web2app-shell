import { createLocalStorageWatchScriptHelper } from './create-local-storage-watch-script.helper';

// A page with its own Storage class, so every test wraps a fresh prototype
const createPage = () => {
  class Storage {
    private items = new Map<string, string>();
    getItem(key: string) {
      return this.items.get(key) ?? null;
    }
    setItem(key: string, value: string) {
      this.items.set(key, String(value));
    }
    removeItem(key: string) {
      this.items.delete(key);
    }
    clear() {
      this.items.clear();
    }
  }
  const unwrappedSetItem = Storage.prototype.setItem;
  const storageListeners: Array<() => void> = [];
  const postMessage = jest.fn<void, [string]>();
  const window = {
    Storage,
    localStorage: new Storage(),
    ReactNativeWebView: { postMessage },
    addEventListener: (_type: string, listener: () => void) =>
      storageListeners.push(listener),
  };

  return {
    localStorage: window.localStorage,
    run: (key: string) =>
      // eslint-disable-next-line no-new-func -- runs the page script as the WebView would
      new Function('window', createLocalStorageWatchScriptHelper(key))(window),
    reports: () => postMessage.mock.calls.map(([data]) => JSON.parse(data)),
    // Another window writes the shared storage without the wrapped methods
    // and this page only gets a storage event
    setItemFromAnotherWindow: (key: string, value: string) => {
      unwrappedSetItem.call(window.localStorage, key, value);
      storageListeners.forEach(listener => listener());
    },
    setItemMethod: () => Storage.prototype.setItem,
  };
};

const report = (hasValue: boolean) => ({
  cmd: 'LOCAL_STORAGE_KEY',
  args: { hasValue },
});

describe('createLocalStorageWatchScriptHelper', () => {
  it('reports the key state on start', () => {
    const signedOut = createPage();
    signedOut.run('token');

    const signedIn = createPage();
    signedIn.localStorage.setItem('token', 'abc');
    signedIn.run('token');

    expect(signedOut.reports()).toEqual([report(false)]);
    expect(signedIn.reports()).toEqual([report(true)]);
  });

  it('reports when the site sets and removes the key', () => {
    const page = createPage();
    page.run('token');

    page.localStorage.setItem('token', 'abc');
    page.localStorage.removeItem('token');

    expect(page.reports()).toEqual([
      report(false),
      report(true),
      report(false),
    ]);
  });

  it('reports when the site clears the storage', () => {
    const page = createPage();
    page.localStorage.setItem('token', 'abc');
    page.run('token');

    page.localStorage.clear();

    expect(page.reports()).toEqual([report(true), report(false)]);
  });

  it('treats an empty value as no token', () => {
    const page = createPage();
    page.run('token');

    page.localStorage.setItem('token', '');

    expect(page.reports()).toEqual([report(false)]);
  });

  it('stays quiet while the key state does not change', () => {
    const page = createPage();
    page.run('token');

    page.localStorage.setItem('theme', 'dark');
    page.localStorage.setItem('token', 'abc');
    page.localStorage.setItem('token', 'refreshed');

    expect(page.reports()).toEqual([report(false), report(true)]);
  });

  it('reports changes made by another window of the site', () => {
    const page = createPage();
    page.run('token');

    page.setItemFromAnotherWindow('token', 'abc');

    expect(page.reports()).toEqual([report(false), report(true)]);
  });

  it('keeps the site calls working', () => {
    const page = createPage();
    page.run('token');

    page.localStorage.setItem('token', 'abc');

    expect(page.localStorage.getItem('token')).toBe('abc');
  });

  it('installs once when injected again on the same page', () => {
    const page = createPage();
    page.run('token');
    const setItem = page.setItemMethod();

    page.run('token');

    expect(page.setItemMethod()).toBe(setItem);
    expect(page.reports()).toEqual([report(false)]);
  });

  it('keeps a key with quotes intact', () => {
    const page = createPage();
    page.localStorage.setItem('auth"token\'', 'abc');

    page.run('auth"token\'');

    expect(page.reports()).toEqual([report(true)]);
  });
});
