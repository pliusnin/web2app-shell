import { BackHandler } from 'react-native';
import { renderHook } from '@testing-library/react-native';

import { useAndroidBackHandler } from './use-android-back-handler';

// Jest подключает iOS-версию BackHandler, которая не вызывает обработчики,
// поэтому тест сам нажимает «назад»
const mockBackHandler = () => {
  const remove = jest.fn();
  let onBackPress:
    Parameters<typeof BackHandler.addEventListener>[1] | undefined;
  const addEventListener = jest
    .spyOn(BackHandler, 'addEventListener')
    .mockImplementation((_eventName, handler) => {
      onBackPress = handler;
      return { remove };
    });

  return {
    addEventListener,
    remove,
    pressBack: () => onBackPress?.({ type: 'hardwareBackPress', timeStamp: 0 }),
  };
};

const renderBackHandler = (handler: () => boolean) =>
  renderHook(
    ({ onBack }: { onBack: () => boolean }) => useAndroidBackHandler(onBack),
    { initialProps: { onBack: handler } },
  );

describe('useAndroidBackHandler', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('subscribes to the hardware back button', async () => {
    const { addEventListener } = mockBackHandler();

    await renderBackHandler(() => true);

    expect(addEventListener).toHaveBeenCalledTimes(1);
    expect(addEventListener).toHaveBeenCalledWith(
      'hardwareBackPress',
      expect.any(Function),
    );
  });

  it.each([true, false])(
    'tells the system the press was handled: %s',
    async handled => {
      const { pressBack } = mockBackHandler();

      await renderBackHandler(() => handled);

      expect(pressBack()).toBe(handled);
    },
  );

  it('calls the latest handler without subscribing again', async () => {
    const { addEventListener, pressBack } = mockBackHandler();
    const first = jest.fn(() => false);
    const second = jest.fn(() => true);

    const { rerender } = await renderBackHandler(first);
    await rerender({ onBack: second });

    expect(pressBack()).toBe(true);
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
    expect(addEventListener).toHaveBeenCalledTimes(1);
  });

  it('unsubscribes on unmount', async () => {
    const { remove } = mockBackHandler();

    const { unmount } = await renderBackHandler(() => true);
    await unmount();

    expect(remove).toHaveBeenCalledTimes(1);
  });
});
