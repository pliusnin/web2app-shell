import { useEffect, useEffectEvent } from 'react';
import { BackHandler } from 'react-native';

export const useAndroidBackHandler = (handler: () => boolean) => {
  const onBackPress = useEffectEvent(handler);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () =>
      onBackPress(),
    );
    return () => subscription.remove();
  }, []);
};
