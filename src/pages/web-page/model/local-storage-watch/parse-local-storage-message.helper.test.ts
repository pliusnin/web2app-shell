import { parseLocalStorageMessageHelper } from './parse-local-storage-message.helper';

const PAGE_URI = 'https://app.example.com/orders';

const message = (data: unknown, url = 'https://app.example.com/login') => ({
  url,
  data: typeof data === 'string' ? data : JSON.stringify(data),
});

describe('parseLocalStorageMessageHelper', () => {
  it('reads the key state reported by a page of the site', () => {
    expect(
      parseLocalStorageMessageHelper(
        message({ cmd: 'LOCAL_STORAGE_KEY', args: { hasValue: true } }),
        PAGE_URI,
      ),
    ).toBe(true);
  });

  it('accepts the bare origin Android reports', () => {
    expect(
      parseLocalStorageMessageHelper(
        message(
          { cmd: 'LOCAL_STORAGE_KEY', args: { hasValue: false } },
          'https://app.example.com',
        ),
        PAGE_URI,
      ),
    ).toBe(false);
  });

  it('drops messages from frames of other sites', () => {
    expect(
      parseLocalStorageMessageHelper(
        message(
          { cmd: 'LOCAL_STORAGE_KEY', args: { hasValue: true } },
          'https://ads.example.net/frame',
        ),
        PAGE_URI,
      ),
    ).toBeUndefined();
  });

  it('drops anything else the page posts', () => {
    const others = [
      'not json',
      'null',
      { cmd: 'WEB_READY' },
      { cmd: 'LOCAL_STORAGE_KEY' },
      { cmd: 'LOCAL_STORAGE_KEY', args: { hasValue: 'yes' } },
    ];

    others.forEach(data =>
      expect(
        parseLocalStorageMessageHelper(message(data), PAGE_URI),
      ).toBeUndefined(),
    );
  });
});
