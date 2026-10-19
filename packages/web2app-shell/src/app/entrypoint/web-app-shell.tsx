import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { useOfflineToast } from '../../features/offline-toast';
import { usePushNotifications } from '../../features/push-notifications';
import type { CheckSession } from '../../features/session';
import { WebPageScreen } from '../../pages/web-page';
import { ConfigProvider, resolveConfig } from '../../shared/config';
import type { AppConfig } from '../../shared/config';
import { useSchemeColors } from '../../shared/lib';
import { ToastHost } from '../../shared/ui';
import { TabsView } from '../../widgets/tabs';
import { useWebViewsReady } from './use-web-views-ready';

type WebAppShellProps = {
  config: AppConfig;
  checkSession?: CheckSession;
};

export const WebAppShell = ({ config, checkSession }: WebAppShellProps) => {
  const resolvedConfig = useMemo(() => resolveConfig(config), [config]);
  const isWebViewsReady = useWebViewsReady(checkSession);
  useOfflineToast();
  usePushNotifications();
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
          {isWebViewsReady && (
            <TabsView renderScene={scene => <WebPageScreen {...scene} />} />
          )}
        </SafeAreaView>

        <ToastHost />
      </SafeAreaProvider>
    </ConfigProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});
