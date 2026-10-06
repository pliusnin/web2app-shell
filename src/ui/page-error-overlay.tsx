import { StyleSheet } from 'react-native';

import { getErrorScreenContent } from '../model';
import type { PageError } from '../model';
import { ErrorScreen } from './error-screen';

type PageErrorOverlayProps = {
  error: PageError | null;
  onRetry: () => void;
};

export const PageErrorOverlay = ({ error, onRetry }: PageErrorOverlayProps) => {
  if (!error) {
    return null;
  }
  return (
    <ErrorScreen
      {...getErrorScreenContent(error)}
      style={StyleSheet.absoluteFill}
      onRetry={onRetry}
    />
  );
};
