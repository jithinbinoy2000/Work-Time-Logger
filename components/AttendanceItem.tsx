import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/theme';
import { MoreHorizontal } from 'lucide-react-native';

export type AttendanceStatus = 'present' | 'full-leave' | 'half-leave' | 'weekend';

interface AttendanceItemProps {
  dayNum: number;
  dayName: string;
  month: string;
  checkIn: string | null;
  checkOut: string | null;
  totalHrs: string | null;
  isWeekend: boolean;
  leaveType: AttendanceStatus | null;
  onMenuPress: () => void;
}

export function AttendanceItem({
  dayNum,
  dayName,
  month,
  checkIn,
  checkOut,
  totalHrs,
  isWeekend,
  leaveType,
  onMenuPress,
}: AttendanceItemProps) {
  
  const getStatusLabel = () => {
    if (leaveType === 'full-leave') return 'Full Day Leave';
    if (leaveType === 'half-leave') return 'Half Day Leave';
    return dayName;
  };

  const getStatusColor = () => {
    if (leaveType) return Colors.accent;
    return Colors.text;
  };

  return (
    <View style={[styles.container, isWeekend && styles.weekend]}>
      <View style={styles.left}>
        <View style={styles.dateBlock}>
          <Text style={styles.dayNum}>{dayNum}</Text>
          <Text style={styles.month}>{month.toUpperCase()}</Text>
        </View>
        <View style={styles.info}>
          <Text style={[styles.statusLabel, { color: getStatusColor() }]}>
            {getStatusLabel()}
          </Text>
          {checkIn && (
            <Text style={styles.timeLabel}>
              {checkIn} — {checkOut || 'Active'}
            </Text>
          )}
        </View>
      </View>
      
      <View style={styles.right}>
        {totalHrs && <Text style={styles.hrsLabel}>{totalHrs} hrs</Text>}
        {!isWeekend && (
          <TouchableOpacity onPress={onMenuPress} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <MoreHorizontal size={20} color={Colors.muted} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    paddingVertical: 15,
    paddingHorizontal: 18,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ECEAE5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  weekend: {
    opacity: 0.7,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  dateBlock: {
    alignItems: 'center',
    minWidth: 40,
  },
  dayNum: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-ExtraBold',
    color: Colors.primary,
    lineHeight: 20,
  },
  month: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.muted,
    marginTop: 1,
  },
  info: {
    gap: 2,
  },
  statusLabel: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  timeLabel: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.muted,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  hrsLabel: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-ExtraBold',
    color: Colors.primary,
  },
});
