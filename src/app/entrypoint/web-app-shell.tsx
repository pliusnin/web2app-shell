import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { useOfflineToast } from '../../features/offline-toast';
import {
  useForegroundNotifications,
  useNotificationsSetup,
} from '../../features/push-notifications';
import { ConfigProvider, resolveConfig } from '../../shared/config';
import type { AppConfig } from '../../shared/config';
import { ToastHost } from '../../shared/ui';
import { TabsView } from '../navigation/tabs-view';
import { useTabBarColors } from '../navigation/use-tab-bar-colors';

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
