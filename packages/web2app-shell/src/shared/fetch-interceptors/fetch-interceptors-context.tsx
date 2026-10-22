import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

import type { FetchInterceptor } from './fetch-interceptors.types';

const FetchInterceptorsContext = createContext<readonly FetchInterceptor[]>([]);

type FetchInterceptorsProviderProps = {
  value: readonly FetchInterceptor[];
  children: ReactNode;
};

export const FetchInterceptorsProvider = ({
  value,
  children,
}: FetchInterceptorsProviderProps) => (
  <FetchInterceptorsContext value={value}>{children}</FetchInterceptorsContext>
);

/**
 * Returns the host app's fetch interceptors, in the order they run. Empty
 * without a provider: interceptors are optional.
 */
export const useFetchInterceptors = () => useContext(FetchInterceptorsContext);
