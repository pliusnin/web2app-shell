import { useState } from 'react';
import type { WebViewProps } from 'react-native-webview';

type LoadProgressHandler = NonNullable<WebViewProps['onLoadProgress']>;

export const useLoadProgress = () => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const onLoadProgress: LoadProgressHandler = ({ nativeEvent }) => {
    setProgress(nativeEvent.progress);
  };

  return {
    progress,
    isLoading,
    onLoadStart: () => {
      setProgress(0);
      setIsLoading(true);
    },
    onLoadProgress,
    onLoadEnd: () => setIsLoading(false),
  };
};
