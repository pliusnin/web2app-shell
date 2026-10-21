/**
 * React Native app example
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { WebAppShell } from 'web2app-shell';

import webAppConfig from './web-app-config.json';

function App() {
  return <WebAppShell config={webAppConfig} />;
}

export default App;
