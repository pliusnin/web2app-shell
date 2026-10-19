// Системный просмотрщик определяет тип файла по расширению
const EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'application/pdf': 'pdf',
  'text/plain': 'txt',
  'text/csv': 'csv',
  'application/json': 'json',
};

/**
 * Оставляет имя файла, заданное сайтом, без символов, недопустимых в пути,
 * и добавляет расширение по типу файла, если в имени его нет.
 */
export const getDownloadFileNameHelper = (
  fileName: string,
  mimeType: string,
) => {
  const name = fileName.replace(/[\\/:*?"<>|]/g, '').trim() || 'download';
  const extension = EXTENSIONS[mimeType.split(';')[0].trim()];

  return extension && !/\.[a-z0-9]+$/i.test(name)
    ? `${name}.${extension}`
    : name;
};
