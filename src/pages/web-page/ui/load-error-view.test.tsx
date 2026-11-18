import { fireEvent, render, screen } from '@testing-library/react-native';

import { TEXTS } from '../../../shared/config';
import { LoadErrorView } from './load-error-view';

describe('LoadErrorView', () => {
  it('tells the user the page did not load', async () => {
    await render(<LoadErrorView onRetry={jest.fn()} />);

    expect(screen.getByText(TEXTS.loadErrorTitle)).toBeOnTheScreen();
    expect(screen.getByText(TEXTS.loadErrorMessage)).toBeOnTheScreen();
  });

  it('retries the load on the button press', async () => {
    const onRetry = jest.fn();
    await render(<LoadErrorView onRetry={onRetry} />);

    fireEvent.press(screen.getByRole('button', { name: TEXTS.loadErrorRetry }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
