import { getTabIconHelper } from './get-tab-icon.helper';
import { mapTabToRouteHelper } from './map-tab-to-route.helper';

const START_URL = 'https://example.com/';

describe('mapTabToRouteHelper', () => {
  it('builds the route of an app tab', () => {
    const route = mapTabToRouteHelper(
      {
        title: 'Catalog',
        icon: 'view-grid',
        url: 'https://example.com/catalog/',
      },
      2,
      START_URL,
    );

    expect(route).toEqual({
      key: 'tab-2',
      title: 'Catalog',
      uri: 'https://example.com/catalog/',
      isExternal: false,
      focusedIcon: getTabIconHelper('view-grid'),
    });
  });

  it('marks a tab on another host as external', () => {
    const route = mapTabToRouteHelper(
      { title: 'Blog', icon: 'information', url: 'https://blog.other.com/' },
      0,
      START_URL,
    );

    expect(route.isExternal).toBe(true);
  });
});
