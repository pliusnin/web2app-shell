import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons/static';

import { TAB_ICON_SIZE } from '../config/tab-icons';
import { getTabIconHelper } from './get-tab-icon.helper';

describe('getTabIconHelper', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it.each(['home', 'information', 'rocket-launch'])(
    'renders "%s" as the Material Design icon of that name',
    name => {
      const getImageSource = jest.spyOn(
        MaterialDesignIcons,
        'getImageSourceSync',
      );

      const icon = getTabIconHelper(name);

      expect(getImageSource).toHaveBeenCalledWith(name, TAB_ICON_SIZE);
      expect(icon).toMatchObject({
        width: TAB_ICON_SIZE,
        height: TAB_ICON_SIZE,
      });
    },
  );

  it('gives no icon and warns about an unknown name', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

    expect(getTabIconHelper('not-an-icon')).toBeUndefined();
    expect(warn).toHaveBeenCalledWith('Unknown tab icon "not-an-icon"');
  });
});
