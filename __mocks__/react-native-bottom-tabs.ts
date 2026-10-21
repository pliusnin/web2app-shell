import { createElement } from 'react';
import type { ReactNode } from 'react';

type TabViewProps<Route> = {
  navigationState: { index: number; routes: Array<Route> };
  renderScene: (props: { route: Route }) => ReactNode;
};

// Tabs are lazy in the library, so only the active scene is mounted at start
const TabView = <Route>({
  navigationState,
  renderScene,
  ...props
}: TabViewProps<Route>) =>
  createElement(
    'RNCTabView',
    { testID: 'tab-view', navigationState, ...props },
    renderScene({ route: navigationState.routes[navigationState.index] }),
  );

export default TabView;
