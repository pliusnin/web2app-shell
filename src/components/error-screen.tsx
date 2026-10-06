import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons/static';
import type { MaterialDesignIconsIconName } from '@react-native-vector-icons/material-design-icons/static';

import { useConfig } from '../config';
import { DEFAULT_PRIMARY_COLOR, TEXTS } from '../constants';

type ErrorScreenProps = {
  icon: MaterialDesignIconsIconName;
  title: string;
  message: string;
  onRetry: () => void;
};

export const ErrorScreen = ({
  icon,
  title,
  message,
  onRetry,
}: ErrorScreenProps) => {
  const { theme } = useConfig();

  return (
    <View style={styles.container}>
      <MaterialDesignIcons name={icon} size={64} color="#9e9e9e" />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      <Pressable
        style={[
          styles.button,
          { backgroundColor: theme.primary ?? DEFAULT_PRIMARY_COLOR },
        ]}
        onPress={onRetry}
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>{TEXTS.retry}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#ffffff',
  },
  title: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: '600',
    color: '#212121',
    textAlign: 'center',
  },
  message: {
    marginTop: 8,
    fontSize: 15,
    color: '#616161',
    textAlign: 'center',
  },
  button: {
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: { fontSize: 16, fontWeight: '600', color: '#ffffff' },
});
