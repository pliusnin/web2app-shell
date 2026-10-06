import type { PageError } from '../types';
import { HttpErrorScreen } from './http-error-screen';
import { NoConnectionScreen } from './no-connection-screen';

type PageErrorOverlayProps = {
  error: PageError | null;
  onRetry: () => void;
};

export const PageErrorOverlay = ({ error, onRetry }: PageErrorOverlayProps) => {
  if (error?.type === 'offline') {
    return <NoConnectionScreen onRetry={onRetry} />;
  }
  if (error?.type === 'http') {
    return <HttpErrorScreen status={error.status} onRetry={onRetry} />;
  }
  return null;
};
