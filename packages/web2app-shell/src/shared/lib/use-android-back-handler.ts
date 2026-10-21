import { useEffect, useEffectEvent } from 'react';
import { BackHandler } from 'react-native';

/**
 * Subscribes to the Android hardware "back" button while the component is
 * mounted and always calls the latest handler. The handler returns true if
 * it handled the press; false leaves it to the system.
 */
export const useAndroidBackHandler = (handler: () => boolean) => {
  const onBackPress = useEffectEvent(handler);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () =>
      onBackPress(),
    );
    return () => subscription.remove();
  }, []);
};
