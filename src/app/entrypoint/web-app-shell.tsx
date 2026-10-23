import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { LockScreen, useLaunchLock } from '../../features/biometric-login';
import { useSiteUpdate } from '../../features/bundled-site';
import { useOfflineToast } from '../../features/offline-toast';
import { usePushNotifications } from '../../features/push-notifications';
import type { CheckSession } from '../../features/session';
import { WebPageScreen } from '../../pages/web-page';
import { ConfigProvider, resolveConfig } from '../../shared/config';
import type { AppConfig } from '../../shared/config';
import { FetchInterceptorsProvider } from '../../shared/fetch-interceptors';
import type { FetchInterceptor } from '../../shared/fetch-interceptors';
import { useSchemeColors } from '../../shared/lib';
import { ToastHost } from '../../shared/ui';
import { TabsView } from '../../widgets/tabs';
import { signOutHelper } from './sign-out.helper';
import { useWebViewsReady } from './use-web-views-ready';

type WebAppShellProps = {
  config: AppConfig;
  checkSession?: CheckSession;
  interceptors?: readonly FetchInterceptor[];
};

export const WebAppShell = ({
  config,
  checkSession,
  interceptors = NO_INTERCEPTORS,
}: WebAppShellProps) => {
  const resolvedConfig = useMemo(() => resolveConfig(config), [config]);
  const isWebViewsReady = useWebViewsReady(checkSession);
  const launchLock = useLaunchLock();
  useSiteUpdate(resolvedConfig.updateUrl);
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
          {isWebViewsReady && launchLock.isUnlocked && (
            <FetchInterceptorsProvider value={interceptors}>
              <TabsView renderScene={scene => <WebPageScreen {...scene} />} />
            </FetchInterceptorsProvider>
          )}
          {isWebViewsReady && launchLock.isLocked && (
            <LockScreen
              isChecking={launchLock.isChecking}
              onUnlock={launchLock.unlock}
              onSignOut={() =>
                signOutHelper().catch(console.warn).finally(launchLock.open)
              }
            />
          )}
        </SafeAreaView>

        <ToastHost />
      </SafeAreaProvider>
    </ConfigProvider>
  );
};

const NO_INTERCEPTORS: readonly FetchInterceptor[] = [];

const styles = StyleSheet.create({
  container: { flex: 1 },
});
