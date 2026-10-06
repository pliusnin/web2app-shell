import { StyleSheet } from 'react-native';

import { BrowserView, ToastHost } from './components';
import { ConfigProvider, resolveConfig } from './config';
import { useOfflineToast } from './hooks';
import type { AppConfig } from './types';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import webAppConfig from '../web-app-config.json';

const appConfig: AppConfig = webAppConfig;

const config = resolveConfig(appConfig);

export const WebAppShell = () => {
  useOfflineToast();

  return (
    <ConfigProvider value={config}>
      <SafeAreaProvider>
        <SafeAreaView
          style={[styles.container, { backgroundColor: config.theme.tabBarBg }]}
          edges={['top', 'left', 'right']}
        >
          <BrowserView />
        </SafeAreaView>

        <ToastHost />
      </SafeAreaProvider>
    </ConfigProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});
