import type { AppConfig, ResolvedConfig } from './app-config.types';

// "/catalog" и "/catalog/" — одна и та же страница
const normalizeUrl = (url: string) => url.replace(/\/+$/, '');

export const resolveConfig = ({
  startUrl,
  userAgentSuffix,
  theme,
  tabs,
}: AppConfig): ResolvedConfig => {
  const startIndex =
    startUrl === undefined
      ? 0
      : tabs.findIndex(tab => normalizeUrl(tab.url) === normalizeUrl(startUrl));

  return {
    userAgentSuffix,
    tabs,
    theme,
    startTabIndex: Math.max(startIndex, 0),
  };
};
