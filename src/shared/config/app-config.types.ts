export type TabConfig = {
  title: string;
  icon: string;
  url: string;
};

export type ThemeConfig = {
  primary: string;
};

export type AppConfig = {
  startUrl?: string;
  updateUrl?: string;
  userAgentSuffix?: string;
  theme: ThemeConfig;
  tabs: Array<TabConfig>;
};

export type ResolvedConfig = Omit<AppConfig, 'startUrl'> & {
  startTabIndex: number;
};
