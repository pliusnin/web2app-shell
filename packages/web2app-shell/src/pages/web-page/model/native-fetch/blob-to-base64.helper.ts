/**
 * Кодирует blob в base64 — в этом виде байты идут через мост. FileReader
 * в React Native читает только data URL, base64 берётся из него.
 */
export const blobToBase64Helper = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '');
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
