import type { AppConfig } from './types.ts';

// "https://example.com" and "https://example.com/" are the same page
const normalizeUrl = (url: string) => url.replace(/\/+$/, '');

// Fills in the defaults. The shape of the config is checked by TypeScript
export const resolveConfig = (config: AppConfig) => {
  const startIndex = config.tabs.findIndex(
    tab => normalizeUrl(tab.url) === normalizeUrl(config.startUrl ?? ''),
  );

  return {
    ...config,
    theme: config.theme ?? {},
    // Unknown or missing startUrl opens the first tab
    startTabIndex: Math.max(startIndex, 0),
  };
};

export type ResolvedConfig = ReturnType<typeof resolveConfig>;
