import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

type ProgressBarProps = {
  progress: number;
  color: string;
  style?: StyleProp<ViewStyle>;
};

export const ProgressBar = ({ progress, color, style }: ProgressBarProps) => (
  <View style={style}>
    <View
      testID="progress-bar-fill"
      style={[
        styles.fill,
        { width: `${progress * 100}%`, backgroundColor: color },
      ]}
    />
  </View>
);

const styles = StyleSheet.create({
  fill: { height: '100%' },
});
