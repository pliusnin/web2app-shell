import { parseDownloadMessageHelper } from './parse-download-message.helper';

const PAGE = 'https://app.example.com/resumes';
const file = {
  fileName: 'resume.pdf',
  url: 'data:application/pdf;base64,AA==',
};
const message = (data: unknown, url = PAGE) => ({
  url,
  data: JSON.stringify(data),
});

describe('parseDownloadMessageHelper', () => {
  it('reads the file of a download command', () => {
    expect(
      parseDownloadMessageHelper(
        message({ cmd: 'DOWNLOAD_FILE', args: file }),
        PAGE,
      ),
    ).toEqual(file);
  });

  it('ignores a frame of another site', () => {
    expect(
      parseDownloadMessageHelper(
        message({ cmd: 'DOWNLOAD_FILE', args: file }, 'https://evil.example'),
        PAGE,
      ),
    ).toBeUndefined();
  });

  it('ignores other commands and broken messages', () => {
    expect(
      parseDownloadMessageHelper(
        message({ cmd: 'LOCAL_STORAGE_KEY', args: { hasValue: true } }),
        PAGE,
      ),
    ).toBeUndefined();
    expect(
      parseDownloadMessageHelper(
        message({ cmd: 'DOWNLOAD_FILE', args: { fileName: 1 } }),
        PAGE,
      ),
    ).toBeUndefined();
    expect(
      parseDownloadMessageHelper({ url: PAGE, data: 'not json' }, PAGE),
    ).toBeUndefined();
  });
});
