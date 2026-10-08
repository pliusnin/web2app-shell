import { renderHook } from '@testing-library/react-native';
import { NetInfoStateType, useNetInfo } from '@react-native-community/netinfo';
import type { NetInfoState } from '@react-native-community/netinfo';

import { useNetworkStatus } from './use-network-status';

const CONNECTED = {
  type: NetInfoStateType.other,
  details: { isConnectionExpensive: false },
} as const;

const cases: Array<[string, NetInfoState, boolean | null]> = [
  [
    'online when connected and the internet is reachable',
    { ...CONNECTED, isConnected: true, isInternetReachable: true },
    true,
  ],
  [
    'offline when not connected',
    {
      type: NetInfoStateType.none,
      isConnected: false,
      isInternetReachable: false,
      details: null,
    },
    false,
  ],
  [
    'offline when connected but the internet is unreachable',
    { ...CONNECTED, isConnected: true, isInternetReachable: false },
    false,
  ],
  [
    'offline when not connected and reachability is still unknown',
    {
      type: NetInfoStateType.unknown,
      isConnected: false,
      isInternetReachable: null,
      details: null,
    },
    false,
  ],
  [
    'unknown when connected but reachability is still unknown',
    { ...CONNECTED, isConnected: true, isInternetReachable: null },
    null,
  ],
  [
    'unknown before NetInfo knows anything',
    {
      type: NetInfoStateType.unknown,
      isConnected: null,
      isInternetReachable: null,
      details: null,
    },
    null,
  ],
];

describe('useNetworkStatus', () => {
  it.each(cases)('is %s', async (_name, state, isOnline) => {
    jest.mocked(useNetInfo).mockReturnValue(state);

    const { result } = await renderHook(useNetworkStatus);

    expect(result.current.isOnline).toBe(isOnline);
  });
});
