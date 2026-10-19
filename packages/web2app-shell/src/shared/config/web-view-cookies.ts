// react-native-webview на iOS использует стандартное хранилище WebKit.
// У Android одно хранилище для WebView и приложения, опцию он игнорирует
export const WEB_VIEW_COOKIE_STORE = { iosCookieStore: 'webKit' } as const;
