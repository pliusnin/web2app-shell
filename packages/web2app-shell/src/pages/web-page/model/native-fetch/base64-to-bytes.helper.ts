// В Hermes есть atob, но типы React Native его не объявляют
declare function atob(base64: string): string;

/**
 * Декодирует base64, в котором байты идут через мост, обратно в байты.
 */
export const base64ToBytesHelper = (base64: string) =>
  Uint8Array.from(atob(base64), char => char.charCodeAt(0));
