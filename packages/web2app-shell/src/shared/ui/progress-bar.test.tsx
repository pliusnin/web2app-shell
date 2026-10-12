import { render, screen } from '@testing-library/react-native';

import { ProgressBar } from './progress-bar';

describe('ProgressBar', () => {
  it.each([
    [0, '0%'],
    [0.4, '40%'],
    [1, '100%'],
  ])('fills %f of the width as %s', async (progress, width) => {
    await render(<ProgressBar progress={progress} color="#1E6FFF" />);

    expect(screen.getByTestId('progress-bar-fill')).toHaveStyle({ width });
  });

  it('fills with the given color', async () => {
    await render(<ProgressBar progress={0.4} color="#1E6FFF" />);

    expect(screen.getByTestId('progress-bar-fill')).toHaveStyle({
      backgroundColor: '#1E6FFF',
    });
  });
});
