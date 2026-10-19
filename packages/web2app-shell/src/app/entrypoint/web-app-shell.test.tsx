import { render, screen } from '@testing-library/react-native';

import { SITE_ORIGIN } from '../../shared/config';
import type { AppConfig } from '../../shared/config';
import { WebAppShell } from './web-app-shell';

const config: AppConfig = {
  startUrl: '/catalog',
  theme: { primary: '#1E6FFF' },
  tabs: [
    { title: 'Home', icon: 'home', url: '/' },
    { title: 'Catalog', icon: 'view-grid', url: '/catalog' },
  ],
};

describe('WebAppShell', () => {
  it('opens the start tab page of the bundled site in the WebView', async () => {
    await render(<WebAppShell config={config} />);

    expect(await screen.findByTestId('web-view')).toHaveProp('source', {
      uri: `${SITE_ORIGIN}/catalog`,
    });
  });
});
