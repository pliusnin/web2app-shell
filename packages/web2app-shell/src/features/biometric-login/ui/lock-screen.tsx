import { Button, StyleSheet, Text, View } from 'react-native';

import { TEXTS } from '../../../shared/config';
import { useSchemeColors } from '../../../shared/lib';

type LockScreenProps = {
  isChecking: boolean;
  onUnlock: () => void;
  onSignOut: () => void;
};

export const LockScreen = ({
  isChecking,
  onUnlock,
  onSignOut,
}: LockScreenProps) => {
  const schemeColors = useSchemeColors();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: schemeColors.foreground }]}>
        {TEXTS.lockTitle}
      </Text>
      <Button
        title={TEXTS.lockUnlock}
        onPress={onUnlock}
        disabled={isChecking}
      />
      <Button
        title={TEXTS.lockSignOut}
        onPress={onSignOut}
        disabled={isChecking}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, marginBottom: 16 },
});
