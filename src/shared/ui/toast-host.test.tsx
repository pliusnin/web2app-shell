import { render, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ToastHost } from './toast-host';

const renderWithTopInset = (top: number) =>
  render(
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width: 390, height: 844 },
        insets: { top, right: 0, bottom: 0, left: 0 },
      }}
    >
      <ToastHost />
    </SafeAreaProvider>,
  );

describe('ToastHost', () => {
  it('places toasts below the notch with a gap', async () => {
    await renderWithTopInset(47);

    expect(screen.getByTestId('toast')).toHaveProp('topOffset', 55);
  });

  it('keeps the gap on screens without a notch', async () => {
    await renderWithTopInset(0);

    expect(screen.getByTestId('toast')).toHaveProp('topOffset', 8);
  });
});
