import type { AppConfig, ResolvedConfig } from './app-config.types';

// "https://example.com" and "https://example.com/" are the same page
const normalizeUrl = (url: string) => url.replace(/\/+$/, '');

export const resolveConfig = ({
  startUrl,
  userAgentSuffix,
  theme,
  tabs,
}: AppConfig): ResolvedConfig => {
  const startIndex = tabs.findIndex(
    tab => normalizeUrl(tab.url) === normalizeUrl(startUrl ?? ''),
  );

  return {
    userAgentSuffix,
    tabs,
    theme,
    startTabIndex: Math.max(startIndex, 0),
  };
};
