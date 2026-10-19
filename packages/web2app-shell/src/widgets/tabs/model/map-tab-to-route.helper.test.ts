import { SITE_ORIGIN } from '../../../shared/config';
import { getTabIconHelper } from './get-tab-icon.helper';
import { mapTabToRouteHelper } from './map-tab-to-route.helper';

describe('mapTabToRouteHelper', () => {
  it('builds the route of a page of the bundled site', () => {
    const route = mapTabToRouteHelper(
      {
        title: 'Catalog',
        icon: 'view-grid',
        url: '/catalog',
      },
      2,
    );

    expect(route).toEqual({
      key: 'tab-2',
      title: 'Catalog',
      uri: `${SITE_ORIGIN}/catalog`,
      isExternal: false,
      focusedIcon: getTabIconHelper('view-grid'),
      unfocusedIcon: getTabIconHelper('view-grid-outline'),
    });
  });

  it('has no inactive icon when the icon has no outline variant', () => {
    const route = mapTabToRouteHelper(
      { title: 'Jira', icon: 'jira', url: '/jira' },
      0,
    );

    expect(route.unfocusedIcon).toBeUndefined();
  });

  it('marks a tab with a URL of another site as external', () => {
    const route = mapTabToRouteHelper(
      { title: 'Blog', icon: 'information', url: 'https://blog.other.com/' },
      0,
    );

    expect(route.isExternal).toBe(true);
  });
});
