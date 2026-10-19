import type { SignedInUser } from '../../../../shared/bridge';

export type BiometricLogin = {
  // Пользователь, вошедший на сайте
  user: SignedInUser | null;
  // Пользователь, включивший биометрический вход
  biometricsUser: SignedInUser | null;
};
