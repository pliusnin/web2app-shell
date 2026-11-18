import { renderHook } from '@testing-library/react-native';
import { open } from 'react-native-file-viewer-turbo';
import Toast from 'react-native-toast-message';

import { TEXTS } from '../../../../shared/config';
import type { MessageHandler } from '../../../../shared/lib';
import { useFileDownload } from './use-file-download';

const PAGE = 'https://app.example.com/resumes';

const post = async (data: unknown, url = PAGE) => {
  const { result } = await renderHook(() => useFileDownload(PAGE));
  result.current({
    nativeEvent: { url, data: JSON.stringify(data) },
  } as Parameters<MessageHandler>[0]);
  // The file is saved and opened asynchronously
  await new Promise<void>(resolve => setTimeout(() => resolve(), 0));
};

describe('useFileDownload', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('opens the file the page sends', async () => {
    await post({
      cmd: 'DOWNLOAD_FILE',
      args: { fileName: 'resume.pdf', url: 'data:application/pdf;base64,AA==' },
    });

    expect(open).toHaveBeenCalledTimes(1);
    expect(Toast.show).not.toHaveBeenCalled();
  });

  it('ignores messages that are not a download', async () => {
    await post({ cmd: 'LOCAL_STORAGE_KEY', args: { hasValue: true } });

    expect(open).not.toHaveBeenCalled();
    expect(Toast.show).not.toHaveBeenCalled();
  });

  it('tells the user when the file cannot be opened', async () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});

    await post({
      cmd: 'DOWNLOAD_FILE',
      args: { fileName: 'resume.pdf', url: 'blob:https://app.example.com/1' },
    });

    expect(open).not.toHaveBeenCalled();
    expect(Toast.show).toHaveBeenCalledWith({
      type: 'error',
      text1: TEXTS.fileOpenError,
    });
  });
});
