import Toast from 'react-native-toast-message';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TOAST_GAP = 8;

// Библиотека тостов не знает о вырезе экрана, поэтому отступ берётся
// из insets
export const ToastHost = () => {
  const { top } = useSafeAreaInsets();

  return <Toast topOffset={top + TOAST_GAP} />;
};
