import Toast from 'react-native-toast-message';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TOAST_GAP = 8;

// The toast library doesn't know about the notch, so the offset comes from the insets
export const ToastHost = () => {
  const { top } = useSafeAreaInsets();

  return <Toast topOffset={top + TOAST_GAP} />;
};
