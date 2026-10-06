import { StyleSheet } from 'react-native';

import { BrowserView } from './components';
import { ConfigProvider, resolveConfig } from './config';
import type { AppConfig } from './config';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import webAppConfig from '../web-app-config.json';

// Typed so that TypeScript checks the JSON against AppConfig
const appConfig: AppConfig = webAppConfig;
// The config is fixed, so it is resolved once when the module loads
const config = resolveConfig(appConfig);

export const WebAppShell = () => {
  return (
    <ConfigProvider value={config}>
      <SafeAreaProvider>
        {/* The tab bar handles the bottom inset itself */}
        <SafeAreaView
          // The area under the notch and the tab bar share one color
          style={[styles.container, { backgroundColor: config.theme.tabBarBg }]}
          edges={['top', 'left', 'right']}
        >
          <BrowserView />
        </SafeAreaView>
      </SafeAreaProvider>
    </ConfigProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});
