import { useMemo, useState } from 'react';
import TabView from 'react-native-bottom-tabs';
import { WebView } from 'react-native-webview';

import type { ImageSourcePropType } from 'react-native';

import type { TabConfig, ThemeConfig } from '../config';
import { tabIcon } from '../config';
import { useAndroidBackHandler, useTabWebViews } from '../hooks';

type TabRoute = {
  key: string;
  title: string;
  uri: string;
  focusedIcon?: ImageSourcePropType;
};

// The config has no tab keys, so the position is the key
const toRoute = (tab: TabConfig, index: number): TabRoute => ({
  key: `tab-${index}`,
  title: tab.title,
  uri: tab.url,
  focusedIcon: tabIcon(tab.icon),
});

type TabsLayoutProps = {
  tabs: ReadonlyArray<TabConfig>;
  initialIndex: number;
  theme: ThemeConfig;
  userAgentSuffix?: string;
};

export const TabsLayout = ({
  tabs,
  initialIndex,
  theme,
  userAgentSuffix,
}: TabsLayoutProps) => {
  const routes = useMemo(() => tabs.map(toRoute), [tabs]);
  const [index, setIndex] = useState(initialIndex);
  const webViews = useTabWebViews();

  // Android back button goes back in the active tab's WebView history
  useAndroidBackHandler(() => webViews.goBack(routes[index].key));

  const onIndexChange = (newIndex: number) => {
    // Pressing the active tab again returns it to its root page
    if (newIndex === index) {
      const { key, uri } = routes[index];
      webViews.open(key, uri);
    }
    setIndex(newIndex);
  };

  return (
    <TabView
      navigationState={{ index, routes }}
      onIndexChange={onIndexChange}
      // On iOS 26 Liquid Glass the bar background may be overridden by the glass
      tabBarActiveTintColor={theme.primary}
      tabBarStyle={{ backgroundColor: theme.tabBarBg }}
      renderScene={({ route }) => (
        <WebView
          ref={webViews.ref(route.key)}
          source={{ uri: route.uri }}
          applicationNameForUserAgent={userAgentSuffix}
          allowsBackForwardNavigationGestures
          onNavigationStateChange={webViews.onNavigationStateChange(route.key)}
        />
      )}
    />
  );
};
