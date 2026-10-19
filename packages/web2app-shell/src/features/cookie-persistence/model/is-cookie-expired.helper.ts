import type { Cookie } from '@preeternal/react-native-cookie-manager';

/**
 * Проверяет, истёк ли срок куки. Кука без срока живёт до конца сессии
 * и никогда не считается истёкшей.
 */
export const isCookieExpiredHelper = ({ expires }: Cookie) =>
  expires !== undefined && Date.parse(expires) <= Date.now();
