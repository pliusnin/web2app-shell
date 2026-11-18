import ReactNativeBlobUtil from 'react-native-blob-util';
import { open } from 'react-native-file-viewer-turbo';

import { openDownloadedFileHelper } from './open-downloaded-file.helper';

describe('openDownloadedFileHelper', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('saves the file to the cache and opens it in the system viewer', async () => {
    await openDownloadedFileHelper({
      fileName: 'resume.pdf',
      url: 'data:application/pdf;base64,JVBERg==',
    });

    expect(ReactNativeBlobUtil.fs.writeFile).toHaveBeenCalledWith(
      '/cache/downloads/resume.pdf',
      'JVBERg==',
      'base64',
    );
    expect(open).toHaveBeenCalledWith(
      '/cache/downloads/resume.pdf',
      expect.objectContaining({ displayName: 'resume.pdf' }),
    );
  });

  it('saves nothing for a URL that is not a base64 data URL', async () => {
    await expect(
      openDownloadedFileHelper({
        fileName: 'resume.pdf',
        url: 'https://example.com/resume.pdf',
      }),
    ).rejects.toThrow();

    expect(ReactNativeBlobUtil.fs.writeFile).not.toHaveBeenCalled();
    expect(open).not.toHaveBeenCalled();
  });
});
