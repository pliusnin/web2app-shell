// On iOS, react-native-webview uses the standard WebKit storage.
// Android has a single storage for the WebView and the app and ignores the
// option
export const WEB_VIEW_COOKIE_STORE = { iosCookieStore: 'webKit' } as const;
