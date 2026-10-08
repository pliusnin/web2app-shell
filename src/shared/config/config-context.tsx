import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

import type { ResolvedConfig } from './app-config.types';

const ConfigContext = createContext<ResolvedConfig | null>(null);

type ConfigProviderProps = {
  value: ResolvedConfig;
  children: ReactNode;
};

export const ConfigProvider = ({ value, children }: ConfigProviderProps) => (
  <ConfigContext value={value}>{children}</ConfigContext>
);

/**
 * Returns the resolved app config from ConfigProvider. Throws outside the
 * provider, so a missing provider fails right away.
 */
export const useConfig = () => {
  const config = useContext(ConfigContext);
  if (!config) {
    throw new Error('useConfig must be used inside ConfigProvider');
  }
  return config;
};
