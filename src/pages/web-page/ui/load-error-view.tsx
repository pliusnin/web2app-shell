import { Button, StyleSheet, Text, View } from 'react-native';

import { TEXTS } from '../../../shared/config';
import { useSchemeColors } from '../../../shared/lib';

type LoadErrorViewProps = {
  onRetry: () => void;
};

export const LoadErrorView = ({ onRetry }: LoadErrorViewProps) => {
  const schemeColors = useSchemeColors();

  return (
    <View
      style={[styles.container, { backgroundColor: schemeColors.background }]}
    >
      <Text style={[styles.title, { color: schemeColors.foreground }]}>
        {TEXTS.loadErrorTitle}
      </Text>
      <Text style={[styles.message, { color: schemeColors.foreground }]}>
        {TEXTS.loadErrorMessage}
      </Text>
      <Button title={TEXTS.loadErrorRetry} onPress={onRetry} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // The WebView draws the error view over the failed page
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: { fontSize: 20, marginBottom: 8, textAlign: 'center' },
  message: { fontSize: 15, marginBottom: 16, textAlign: 'center' },
});
