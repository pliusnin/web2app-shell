import { TEXTS } from '../constants';
import { ErrorScreen } from './error-screen';

type HttpErrorScreenProps = {
  status: number;
  onRetry: () => void;
};

export const HttpErrorScreen = ({ status, onRetry }: HttpErrorScreenProps) => (
  <ErrorScreen
    icon="alert-circle-outline"
    title={TEXTS.httpErrorTitle}
    message={TEXTS.httpErrorMessage(status)}
    onRetry={onRetry}
  />
);
