// Hermes has atob, but the React Native types do not declare it
declare function atob(base64: string): string;

/**
 * Decodes the base64 in which bytes go through the bridge back into bytes.
 */
export const base64ToBytesHelper = (base64: string) =>
  Uint8Array.from(atob(base64), char => char.charCodeAt(0));
