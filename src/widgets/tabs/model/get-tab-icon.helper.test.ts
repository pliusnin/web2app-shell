import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons/static';

import { TAB_ICON_SIZE, TAB_ICONS } from '../config/tab-icons';
import { getTabIconHelper } from './get-tab-icon.helper';

describe('getTabIconHelper', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it.each(Object.entries(TAB_ICONS))(
    'renders "%s" as the "%s" Material Design icon',
    (name, iconName) => {
      const getImageSource = jest.spyOn(
        MaterialDesignIcons,
        'getImageSourceSync',
      );

      const icon = getTabIconHelper(name);

      expect(getImageSource).toHaveBeenCalledWith(iconName, TAB_ICON_SIZE);
      expect(icon).toMatchObject({
        width: TAB_ICON_SIZE,
        height: TAB_ICON_SIZE,
      });
    },
  );

  it('gives no icon and warns about an unknown name', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

    expect(getTabIconHelper('rocket')).toBeUndefined();
    expect(warn).toHaveBeenCalledWith('Unknown tab icon "rocket"');
  });
});
