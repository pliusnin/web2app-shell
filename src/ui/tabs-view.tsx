import { useMemo } from 'react';
import TabView from 'react-native-bottom-tabs';

import { useConfig } from '../config';
import {
  toTabRoute,
  useTabBarInactiveColor,
  useTabNavigation,
  useTabWebViews,
} from '../model';
import { TabScreen } from './tab-screen';

export const TabsView = () => {
  const { tabs, startTabIndex, theme } = useConfig();

  const routes = useMemo(() => tabs.map(toTabRoute), [tabs]);
  const webViews = useTabWebViews();
  const inactiveTintColor = useTabBarInactiveColor();
  const { index, onIndexChange } = useTabNavigation(
    routes,
    startTabIndex,
    webViews,
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      onIndexChange={onIndexChange}
      tabBarActiveTintColor={theme.primary}
      tabBarInactiveTintColor={inactiveTintColor}
      tabBarStyle={{ backgroundColor: theme.tabBarBg }}
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
