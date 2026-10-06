import { useMemo } from 'react';
import TabView from 'react-native-bottom-tabs';

import { tabIcon, useConfig } from '../config';
import { useTabNavigation, useTabWebViews } from '../hooks';
import type { TabConfig, TabRoute } from '../types';
import { BrowserScreen } from './browser-screen';

const toRoute = (tab: TabConfig, index: number): TabRoute => ({
  key: `tab-${index}`,
  title: tab.title,
  uri: tab.url,
  focusedIcon: tabIcon(tab.icon),
});

export const BrowserView = () => {
  const { tabs, startTabIndex, theme } = useConfig();

  const routes = useMemo(() => tabs.map(toRoute), [tabs]);
  const webViews = useTabWebViews();
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
      tabBarStyle={{ backgroundColor: theme.tabBarBg }}
      renderScene={({ route }) => (
        <BrowserScreen
          ref={webViews.ref(route.key)}
          uri={route.uri}
          onNavigationStateChange={webViews.onNavigationStateChange(route.key)}
        />
      )}
    />
  );
};
