import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { ConfigProvider, resolveConfig } from './config';
import {
  useForegroundNotifications,
  useNotificationsSetup,
  useOfflineToast,
  useTabBarColors,
} from './model';
import type { AppConfig } from './model';
import { TabsView, ToastHost } from './ui';

type WebAppShellProps = {
  config: AppConfig;
};

export const WebAppShell = ({ config }: WebAppShellProps) => {
  const resolvedConfig = useMemo(() => resolveConfig(config), [config]);
  useOfflineToast();
  useNotificationsSetup();
  useForegroundNotifications();
  const tabBarColors = useTabBarColors();

  return (
    <ConfigProvider value={resolvedConfig}>
      <SafeAreaProvider>
        <SafeAreaView
          style={[
            styles.container,
            { backgroundColor: tabBarColors.background },
          ]}
          edges={['top', 'left', 'right']}
        >
          <TabsView />
        </SafeAreaView>

        <ToastHost />
      </SafeAreaProvider>
    </ConfigProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});
