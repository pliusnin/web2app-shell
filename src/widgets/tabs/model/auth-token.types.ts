export type AuthToken = {
  storage: 'cookie' | 'localStorage';
  // Cookie name or localStorage key; a non-empty value means signed in
  key: string;
};
