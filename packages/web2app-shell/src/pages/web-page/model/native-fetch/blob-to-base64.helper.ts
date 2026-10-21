/**
 * Encodes a blob as base64, the form in which bytes go through the bridge.
 * FileReader in React Native reads only a data URL; base64 is taken from it.
 */
export const blobToBase64Helper = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '');
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
