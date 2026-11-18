import { getDownloadFileNameHelper } from './get-download-file-name.helper';

describe('getDownloadFileNameHelper', () => {
  it('keeps the name the site gave', () => {
    expect(getDownloadFileNameHelper('resume.pdf', 'application/pdf')).toBe(
      'resume.pdf',
    );
  });

  it('adds the extension of the file type when the name has none', () => {
    expect(getDownloadFileNameHelper('resume', 'application/pdf')).toBe(
      'resume.pdf',
    );
  });

  it('removes characters that would change the path', () => {
    expect(getDownloadFileNameHelper('../../etc/pass:wd', 'text/plain')).toBe(
      'etcpasswd.txt',
    );
  });

  it('falls back to a default name', () => {
    expect(getDownloadFileNameHelper(' / ', 'application/pdf')).toBe(
      'download.pdf',
    );
    expect(getDownloadFileNameHelper('..', 'application/pdf')).toBe(
      'download.pdf',
    );
  });
});
