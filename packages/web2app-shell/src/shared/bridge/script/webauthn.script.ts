// WebAuthn как проверка пользователя: приложение показывает свой
// биометрический промпт. Ключа за этим нет, только флаг UV, который читает
// сайт, использующий WebAuthn как замок
export const WEBAUTHN_SCRIPT = `
  const verifiedCredential = async rawId => {
    if (!(await callApp('VERIFY_USER'))) {
      throw new DOMException('The user did not confirm', 'NotAllowedError');
    }
    // Флаги UP (0x01) и UV (0x04) после 32 байт хеша rpId
    const authenticatorData = new Uint8Array(37);
    authenticatorData[32] = 0x05;
    return {
      rawId,
      type: 'public-key',
      response: {
        authenticatorData: authenticatorData.buffer,
        getAuthenticatorData: () => authenticatorData.buffer,
      },
    };
  };

  Object.defineProperty(navigator, 'credentials', {
    value: {
      create: () =>
        verifiedCredential(crypto.getRandomValues(new Uint8Array(16)).buffer),
      get: ({ publicKey }) => verifiedCredential(publicKey.allowCredentials[0].id),
    },
  });

  window.PublicKeyCredential = {
    isUserVerifyingPlatformAuthenticatorAvailable: () =>
      callApp('IS_BIOMETRICS_AVAILABLE'),
  };
`;
