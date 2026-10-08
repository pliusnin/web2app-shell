import { renderHook } from '@testing-library/react-native';
import { NetInfoStateType, useNetInfo } from '@react-native-community/netinfo';
import type { NetInfoState } from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';

import { TEXTS } from '../../../shared/config';
import { useOfflineToast } from './use-offline-toast';

const ONLINE: NetInfoState = {
  type: NetInfoStateType.other,
  isConnected: true,
  isInternetReachable: true,
  details: { isConnectionExpensive: false },
};

const OFFLINE: NetInfoState = {
  type: NetInfoStateType.none,
  isConnected: false,
  isInternetReachable: false,
  details: null,
};

const netInfo = jest.mocked(useNetInfo);

const renderWithNetwork = async (...states: Array<NetInfoState>) => {
  const [initial, ...changes] = states;
  netInfo.mockReturnValue(initial);
  const { rerender } = await renderHook(useOfflineToast);

  for (const state of changes) {
    netInfo.mockReturnValue(state);
    await rerender(undefined);
  }
};

describe('useOfflineToast', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows the toast when the connection drops', async () => {
    await renderWithNetwork(ONLINE, OFFLINE);

    expect(Toast.show).toHaveBeenCalledTimes(1);
    expect(Toast.show).toHaveBeenCalledWith({
      type: 'info',
      text1: TEXTS.offlineTitle,
    });
  });

  it('shows nothing when the app starts offline', async () => {
    await renderWithNetwork(OFFLINE);

    expect(Toast.show).not.toHaveBeenCalled();
  });

  it('shows nothing when the connection comes back', async () => {
    await renderWithNetwork(OFFLINE, ONLINE);

    expect(Toast.show).not.toHaveBeenCalled();
  });
});
