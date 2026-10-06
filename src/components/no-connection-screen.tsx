import { TEXTS } from '../constants';
import { ErrorScreen } from './error-screen';

type NoConnectionScreenProps = {
  onRetry: () => void;
};

export const NoConnectionScreen = ({ onRetry }: NoConnectionScreenProps) => (
  <ErrorScreen
    icon="wifi-off"
    title={TEXTS.noConnectionTitle}
    message={TEXTS.noConnectionMessage}
    onRetry={onRetry}
  />
);
