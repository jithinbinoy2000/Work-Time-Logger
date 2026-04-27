import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming,
  withSequence
} from 'react-native-reanimated';

interface StatCardProps {
  label: string;
  value: string;
  Icon: React.FC<{ color: string }>;
  isLast?: boolean;
  isActive?: boolean;
}

export function StatCard({ label, value, Icon, isLast, isActive }: StatCardProps) {
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (isActive) {
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.2, { duration: 500 }),
          withTiming(1, { duration: 500 })
        ),
        -1,
        true
      );
    } else {
      opacity.value = 1;
    }
  }, [isActive, opacity]);

  const animatedColonStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const renderValue = () => {
    if (value.includes(':')) {
      const parts = value.split(':');
      return (
        <Text style={[styles.value, { color: isActive ? Colors.primary : Colors.text }]}>
          {parts[0]}
          <Animated.Text style={animatedColonStyle}>:</Animated.Text>
          {parts[1]}
        </Text>
      );
    }
    return (
      <Text style={[styles.value, { color: isActive ? Colors.primary : Colors.text }]}>
        {value}
      </Text>
    );
  };

  return (
    <View style={[styles.container, !isLast && styles.borderRight]}>
      <View style={styles.iconContainer}>
        <Icon color={Colors.primary} />
      </View>
      {renderValue()}
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 6,
    gap: 5,
  },
  borderRight: {
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  iconContainer: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-ExtraBold',
    letterSpacing: 0.2,
  },
  label: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.muted,
    letterSpacing: 0.3,
    textAlign: 'center',
  },
});
