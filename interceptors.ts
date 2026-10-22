import type { FetchInterceptor } from 'web2app-shell';

let accessToken: string | undefined;

export const interceptors: FetchInterceptor[] = [
  {
    onResponse: async response => {
      const data = await response.json().catch(() => null);
      if (data?.access_token) {
        accessToken = data.access_token;
        console.log('access_token interceptor worked', accessToken);
      }
    },
  },
];
