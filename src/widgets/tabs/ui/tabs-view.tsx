import { Fragment, useMemo } from 'react';
import type { ReactNode } from 'react';
import TabView from 'react-native-bottom-tabs';

import { useConfig } from '../../../shared/config';
import type { AuthToken } from '../model/auth-token.types';
import { mapTabToRouteHelper } from '../model/map-tab-to-route.helper';
import type { TabScene } from '../model/tabs.types';
import { useTabBarColors } from '../model/use-tab-bar-colors';
import { useTabBarHidden } from '../model/use-tab-bar-hidden';
import { useTabNavigation } from '../model/use-tab-navigation';
import { useTabWebViews } from '../model/use-tab-web-views';

type TabsViewProps = {
  renderScene: (scene: TabScene) => ReactNode;
  authToken?: AuthToken;
};

export const TabsView = ({ renderScene, authToken }: TabsViewProps) => {
  const { tabs, startTabIndex, theme } = useConfig();

  const routes = useMemo(() => tabs.map(mapTabToRouteHelper), [tabs]);
  const webViews = useTabWebViews();
  const tabBarColors = useTabBarColors();
  const { index, onIndexChange } = useTabNavigation(
    routes,
    startTabIndex,
    webViews,
  );
  const activeRoute = routes[index];
  const tabBar = useTabBarHidden(authToken, activeRoute);

  return (
    <TabView
      navigationState={{ index, routes }}
      onIndexChange={onIndexChange}
      getPreventsDefault={({ route }) => route.isExternal}
      tabBarHidden={tabBar.isHidden}
      tabBarActiveTintColor={theme.primary}
      tabBarInactiveTintColor={tabBarColors.inactiveTint}
      tabBarStyle={{ backgroundColor: tabBarColors.background }}
      renderScene={({ route }) => {
        const source = webViews.source(route.key, route.uri);
        const trackNavigation = webViews.onNavigationStateChange(route.key);

        return (
          <Fragment key={source.version}>
            {renderScene({
              ref: webViews.ref(route.key),
              uri: source.uri,
              onNavigationStateChange: navState => {
                trackNavigation(navState);
                tabBar.onNavigationStateChange(route.key)(navState);
              },
              localStorageKey: tabBar.localStorageKey,
              onLocalStorageKeyChange: tabBar.onLocalStorageKeyChange(
                route.key,
              ),
            })}
          </Fragment>
        );
      }}
    />
  );
};
