import type { ReactNode } from 'react';
import { render, screen, userEvent } from '@testing-library/react-native';

import { ConfigProvider, TEXTS } from '../../../shared/config';
import type { ResolvedConfig } from '../../../shared/config';
import { ErrorScreen } from './error-screen';

const config: ResolvedConfig = {
  startUrl: 'https://example.com/',
  theme: { primary: '#1E6FFF' },
  tabs: [{ title: 'Home', icon: 'home', url: 'https://example.com/' }],
  startTabIndex: 0,
};

const wrapper = ({ children }: { children: ReactNode }) => (
  <ConfigProvider value={config}>{children}</ConfigProvider>
);

const renderErrorScreen = (onRetry = jest.fn()) =>
  render(
    <ErrorScreen
      icon="wifi-off"
      title="No internet connection"
      message="Check your connection."
      onRetry={onRetry}
    />,
    { wrapper },
  );

describe('ErrorScreen', () => {
  it('shows the title and the message', async () => {
    await renderErrorScreen();

    expect(screen.getByText('No internet connection')).toBeOnTheScreen();
    expect(screen.getByText('Check your connection.')).toBeOnTheScreen();
  });

  it('calls onRetry when the retry button is pressed', async () => {
    const onRetry = jest.fn();
    await renderErrorScreen(onRetry);

    await userEvent
      .setup()
      .press(screen.getByRole('button', { name: TEXTS.retryButton }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('paints the retry button in the theme color', async () => {
    await renderErrorScreen();

    expect(screen.getByRole('button', { name: TEXTS.retryButton })).toHaveStyle(
      { backgroundColor: config.theme.primary },
    );
  });
});
