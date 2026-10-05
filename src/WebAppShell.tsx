import { StyleSheet } from 'react-native';

import { TabsLayout } from './components';
import { resolveConfig } from './config';
import type { AppConfig } from './config';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import webAppConfig from '../web-app-config.json';

// Typed so that TypeScript checks the JSON against AppConfig
const config: AppConfig = webAppConfig;
const { tabs, startTabIndex, theme, userAgentSuffix } = resolveConfig(config);

export const WebAppShell = () => {
  return (
    <SafeAreaProvider>
      {/* The tab bar handles the bottom inset itself */}
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <TabsLayout
          tabs={tabs}
          initialIndex={startTabIndex}
          theme={theme}
          userAgentSuffix={userAgentSuffix}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});
