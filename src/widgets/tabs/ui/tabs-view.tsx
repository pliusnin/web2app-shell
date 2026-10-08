import { useMemo } from 'react';
import type { ReactNode } from 'react';
import TabView from 'react-native-bottom-tabs';

import { useConfig } from '../../../shared/config';
import { mapTabToRouteHelper } from '../model/map-tab-to-route.helper';
import type { TabScene } from '../model/tabs.types';
import { useTabBarColors } from '../model/use-tab-bar-colors';
import { useTabNavigation } from '../model/use-tab-navigation';
import { useTabWebViews } from '../model/use-tab-web-views';

type TabsViewProps = {
  renderScene: (scene: TabScene) => ReactNode;
};

export const TabsView = ({ renderScene }: TabsViewProps) => {
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
      renderScene={({ route }) =>
        renderScene({
          ref: webViews.ref(route.key),
          uri: route.uri,
          onNavigationStateChange: webViews.onNavigationStateChange(route.key),
        })
      }
    />
  );
};
