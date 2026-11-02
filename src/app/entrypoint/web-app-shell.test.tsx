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

  it('keeps the tabs visible by default', async () => {
    await render(<WebAppShell config={config} />);

    expect(await screen.findByTestId('tab-view')).toHaveProp(
      'tabBarHidden',
      false,
    );
  });

  it('hides the tabs while the user is signed out when asked to', async () => {
    await render(
      <WebAppShell
        config={config}
        hideTabsWhenSignedOut
        authToken={{ storage: 'cookie', key: 'sid' }}
      />,
    );

    expect(await screen.findByTestId('tab-view')).toHaveProp(
      'tabBarHidden',
      true,
    );
  });

  it('runs the localStorage watch in the page for a localStorage token', async () => {
    await render(
      <WebAppShell
        config={config}
        hideTabsWhenSignedOut
        authToken={{ storage: 'localStorage', key: 'token' }}
      />,
    );

    const webView = await screen.findByTestId('web-view');
    expect(webView.props.injectedJavaScriptBeforeContentLoaded).toContain(
      '"token"',
    );
    expect(webView.props.onMessage).toEqual(expect.any(Function));
  });

  it('adds no script to the page without hiding the tabs', async () => {
    await render(<WebAppShell config={config} />);

    const webView = await screen.findByTestId('web-view');
    expect(webView.props.injectedJavaScriptBeforeContentLoaded).toBeUndefined();
    expect(webView.props.onMessage).toBeUndefined();
  });
});
