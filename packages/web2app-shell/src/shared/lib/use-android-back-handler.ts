import { useEffect, useEffectEvent } from 'react';
import { BackHandler } from 'react-native';

/**
 * Подписывается на аппаратную кнопку «назад» Android, пока компонент
 * смонтирован, и всегда вызывает последний обработчик. Обработчик возвращает
 * true, если обработал нажатие; false оставляет его системе.
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
