import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons/static';

import { COLORS, TEXTS, useConfig } from '../../../shared/config';
import type { ErrorScreenContent } from '../model/page-load/error-screen-content.types';

type ErrorScreenProps = ErrorScreenContent & {
  onRetry: () => void;
  style?: StyleProp<ViewStyle>;
};

export const ErrorScreen = ({
  icon,
  title,
  message,
  onRetry,
  style,
}: ErrorScreenProps) => {
  const { theme } = useConfig();

  return (
    <View style={[styles.container, style]}>
      <MaterialDesignIcons name={icon} size={64} color={COLORS.icon} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: theme.primary },
          pressed && styles.buttonPressed,
        ]}
        onPress={onRetry}
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>{TEXTS.retryButton}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: COLORS.white,
  },
  title: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  message: {
    marginTop: 8,
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  button: {
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonPressed: { opacity: 0.6 },
  buttonText: { fontSize: 16, fontWeight: '600', color: COLORS.white },
});
