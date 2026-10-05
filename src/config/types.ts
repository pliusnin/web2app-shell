export type TabConfig = {
  title: string;
  // Name from the icons table, a tab with an unknown name has no icon
  icon: string;
  url: string;
};

// Colors are hex strings. A missing color keeps the native default
export type ThemeConfig = {
  primary?: string;
  tabBarBg?: string;
};

// Shape of web-app-config.json
export type AppConfig = {
  // URL of the tab that is open when the app starts, defaults to the first tab
  startUrl?: string;
  // Appended to the WebView's default user agent
  userAgentSuffix?: string;
  theme?: ThemeConfig;
  tabs: Array<TabConfig>;
};
