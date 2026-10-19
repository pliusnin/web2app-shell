import { isAppUrlHelper } from '../../../features/link-routing';
import { SITE_ORIGIN, type TabConfig } from '../../../shared/config';
import { getOutlineTabIconHelper } from './get-outline-tab-icon.helper';
import { getTabIconHelper } from './get-tab-icon.helper';
import type { TabRoute } from './tabs.types';

/**
 * Превращает таб из конфига в маршрут таб-бара: key, title, URL на локальном
 * origin для пути сайта ("/catalog"), залитая иконка для активного таба
 * и контурная для неактивного, isExternal для табов с URL другого сайта,
 * которые открываются вне приложения, а не переключают таб.
 */
export const mapTabToRouteHelper = (
  tab: TabConfig,
  index: number,
): TabRoute => {
  const uri = tab.url.startsWith('/') ? `${SITE_ORIGIN}${tab.url}` : tab.url;

  return {
    key: `tab-${index}`,
    title: tab.title,
    uri,
    isExternal: !isAppUrlHelper(uri),
    focusedIcon: getTabIconHelper(tab.icon),
    unfocusedIcon: getOutlineTabIconHelper(tab.icon),
  };
};
