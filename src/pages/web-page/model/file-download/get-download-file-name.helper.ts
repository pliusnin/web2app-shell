// The system viewer determines the file type by its extension
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
 * Keeps the file name set by the site, without characters not allowed in a
 * path or leading dots, and adds an extension based on the file type if the
 * name has none.
 */
export const getDownloadFileNameHelper = (
  fileName: string,
  mimeType: string,
) => {
  const name =
    fileName
      .replace(/[\\/:*?"<>|]/g, '')
      // No "." or ".." and no hidden files: the name stays inside the folder
      .replace(/^[.\s]+/, '')
      .trim() || 'download';
  const extension = EXTENSIONS[mimeType.split(';')[0].trim()];

  return extension && !/\.[a-z0-9]+$/i.test(name)
    ? `${name}.${extension}`
    : name;
};
