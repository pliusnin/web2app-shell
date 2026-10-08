import { render, screen } from '@testing-library/react-native';

import type { AppConfig } from '../../shared/config';
import { WebAppShell } from './web-app-shell';

const config: AppConfig = {
  startUrl: 'https://example.com/catalog/',
  theme: { primary: '#1E6FFF' },
  tabs: [
    { title: 'Home', icon: 'home', url: 'https://example.com/' },
    { title: 'Catalog', icon: 'grid', url: 'https://example.com/catalog/' },
  ],
};

describe('WebAppShell', () => {
  it('opens the start tab page in the WebView', async () => {
    await render(<WebAppShell config={config} />);

    expect(screen.getByTestId('web-view')).toHaveProp('source', {
      uri: 'https://example.com/catalog/',
    });
  });
});
