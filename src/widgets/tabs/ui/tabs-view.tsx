import { useMemo } from 'react';
import TabView from 'react-native-bottom-tabs';

import { TabScreen } from '../../pages/web-page';
import { useConfig } from '../../shared/config';
import { mapTabToRouteHelper } from './map-tab-to-route.helper';
import { useTabBarColors } from './use-tab-bar-colors';
import { useTabNavigation } from './use-tab-navigation';
import { useTabWebViews } from './use-tab-web-views';

export const TabsView = () => {
  const { tabs, startTabIndex, startUrl, theme } = useConfig();

  const routes = useMemo(
    () => tabs.map((tab, index) => mapTabToRouteHelper(tab, index, startUrl)),
    [tabs, startUrl],
  );
  const webViews = useTabWebViews();
  const tabBarColors = useTabBarColors();
  const { index, onIndexChange } = useTabNavigation(
    routes,
    startTabIndex,
    webViews,
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      onIndexChange={onIndexChange}
      getPreventsDefault={({ route }) => route.isExternal}
      tabBarActiveTintColor={theme.primary}
      tabBarInactiveTintColor={tabBarColors.inactiveTint}
      tabBarStyle={{ backgroundColor: tabBarColors.background }}
      renderScene={({ route }) => (
        <TabScreen
          ref={webViews.ref(route.key)}
          uri={route.uri}
          onNavigationStateChange={webViews.onNavigationStateChange(route.key)}
        />
      )}
    />
  );
};
