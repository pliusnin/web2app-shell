import { parseFileDataUrlHelper } from './parse-file-data-url.helper';

describe('parseFileDataUrlHelper', () => {
  it('reads the type and the bytes of a base64 data URL', () => {
    expect(
      parseFileDataUrlHelper('data:application/pdf;base64,JVBERg=='),
    ).toEqual({ mimeType: 'application/pdf', base64: 'JVBERg==' });
  });

  it('skips the parameters between the type and the encoding', () => {
    expect(
      parseFileDataUrlHelper('data:text/plain;charset=utf-8;base64,aGk='),
    ).toEqual({ mimeType: 'text/plain', base64: 'aGk=' });
  });

  it.each([
    'https://example.com/file.pdf',
    'blob:https://example.com/1f0c',
    'data:text/plain,hello',
    'data:application/pdf;base64,not base64!',
    '',
  ])('rejects %p', url => {
    expect(parseFileDataUrlHelper(url)).toBeUndefined();
  });
});
