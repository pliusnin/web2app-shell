import { getHostHelper } from '../../../shared/lib';

export const isAppUrlHelper = (url: string, startUrl: string) => {
  const host = getHostHelper(url);
  return host !== undefined && host === getHostHelper(startUrl);
};
