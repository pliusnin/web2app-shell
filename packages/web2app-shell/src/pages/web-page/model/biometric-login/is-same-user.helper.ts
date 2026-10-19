import type { SignedInUser } from '../../../../shared/bridge';

/**
 * Сравнивает пользователей по логину без учёта регистра, как сервер сайта.
 */
export const isSameUserHelper = (first: SignedInUser, second: SignedInUser) =>
  first.login.toLowerCase() === second.login.toLowerCase();
