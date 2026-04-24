import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';

interface StatCardProps {
  label: string;
  value: string;
  Icon: React.FC<{ color: string }>;
  isLast?: boolean;
}

export function StatCard({ label, value, Icon, isLast }: StatCardProps) {
  return (
    <View style={[styles.container, !isLast && styles.borderRight]}>
      <View style={styles.iconContainer}>
        <Icon color={Colors.primary} />
      </View>
      <Text style={styles.value}>{value}</Text>
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
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.text,
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
