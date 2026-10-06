import type { AppConfig, ResolvedConfig } from '../types';

// "https://example.com" and "https://example.com/" are the same page
const normalizeUrl = (url: string) => url.replace(/\/+$/, '');

// Fills in the defaults. The shape of the config is checked by TypeScript
export const resolveConfig = (config: AppConfig): ResolvedConfig => {
  const startIndex = config.tabs.findIndex(
    tab => normalizeUrl(tab.url) === normalizeUrl(config.startUrl ?? ''),
  );

  return {
    ...config,
    theme: config.theme ?? {},
    startTabIndex: Math.max(startIndex, 0),
  };
};
