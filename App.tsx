/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { WebAppShell } from './src';

import webAppConfig from './web-app-config.json';

function App() {
  return <WebAppShell config={webAppConfig} />;
}

export default App;
