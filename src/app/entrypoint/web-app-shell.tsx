import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { useOfflineToast } from '../../features/offline-toast';
import {
  useForegroundNotifications,
  useNotificationsSetup,
} from '../../features/push-notifications';
import { WebPageScreen } from '../../pages/web-page';
import { ConfigProvider, resolveConfig } from '../../shared/config';
import type { AppConfig } from '../../shared/config';
import { useSchemeColors } from '../../shared/lib';
import { ToastHost } from '../../shared/ui';
import { TabsView } from '../../widgets/tabs';

type WebAppShellProps = {
  config: AppConfig;
};

export const WebAppShell = ({ config }: WebAppShellProps) => {
  const resolvedConfig = useMemo(() => resolveConfig(config), [config]);
  useOfflineToast();
  useNotificationsSetup();
  useForegroundNotifications();
  const schemeColors = useSchemeColors();

  return (
    <ConfigProvider value={resolvedConfig}>
      <SafeAreaProvider>
        <SafeAreaView
          style={[
            styles.container,
            { backgroundColor: schemeColors.background },
          ]}
          edges={['top', 'left', 'right']}
        >
          <TabsView renderScene={scene => <WebPageScreen {...scene} />} />
        </SafeAreaView>

        <ToastHost />
      </SafeAreaProvider>
    </ConfigProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});
