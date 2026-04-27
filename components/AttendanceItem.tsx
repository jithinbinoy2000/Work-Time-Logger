import { Colors } from '@/constants/theme';
import { MoreHorizontal } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type AttendanceStatus = 'present' | 'full-leave' | 'half-leave' | 'weekend' | 'holiday';

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
  isSelected?: boolean;
  onPress?: () => void;
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
  isSelected,
  onPress,
}: AttendanceItemProps) {

  const getStatusLabel = () => {
    if (leaveType === 'full-leave') return 'Full Day Leave';
    if (leaveType === 'half-leave') return 'Half Day Leave';
    if (leaveType === 'holiday') return 'Holiday';
    if (isWeekend) return 'Weekend';
    return 'Present';
  };

  const getStatusColor = () => {
    if (leaveType === 'full-leave') return Colors.accent;
    if (leaveType === 'half-leave') return '#E07070';
    if (leaveType === 'holiday') return Colors.primary;
    if (isWeekend) return Colors.muted;
    return Colors.primary;
  };

  const getStatusBg = () => {
    if (leaveType === 'full-leave') return '#FEF3E2';
    if (leaveType === 'half-leave') return '#FFF0F0';
    if (leaveType === 'holiday') return '#E8F5EE';
    if (isWeekend) return '#F0F0F0';
    return '#E8F5EE';
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.container, isWeekend && styles.weekend, isSelected && styles.selected]}
    >
      <View style={styles.left}>
        <View style={[styles.dateBlock, { backgroundColor: isWeekend ? '#F0F0F0' : Colors.primary }]}>
          <Text style={[styles.dayNum, { color: isWeekend ? Colors.muted : '#FFF' }]}>{dayNum}</Text>
          <Text style={[styles.dayName, { color: isWeekend ? Colors.muted : 'rgba(255,255,255,0.8)' }]}>
            {dayName.substring(0, 3).toUpperCase()}
          </Text>
        </View>
        <View style={styles.info}>
          {isWeekend || leaveType ? (
            <View>
              <Text style={styles.leaveText}>
                {leaveType === 'full-leave' ? 'Full Day Leave' : leaveType === 'half-leave' ? 'Half Day Leave' : leaveType === 'holiday' ? 'Holiday' : 'Weekend'}
              </Text>
              <Text style={styles.dateSubText}>{month} {dayNum}</Text>
            </View>
          ) : (
            <View>
              <View style={styles.timesGrid}>
                <View style={styles.timeColumn}>
                  <Text style={styles.timeVal}>{checkIn || '--'}</Text>
                  <Text style={styles.timeLabel}>In</Text>
                </View>
                <View style={styles.timeColumn}>
                  <Text style={styles.timeVal}>{checkOut || '--'}</Text>
                  <Text style={styles.timeLabel}>Out</Text>
                </View>
                <View style={styles.timeColumn}>
                  <Text style={styles.timeVal}>{totalHrs || '--'}</Text>
                  <Text style={styles.timeLabel}>Hrs</Text>
                </View>
              </View>
              <Text style={styles.dateSubText}>{month} {dayNum}</Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.right}>
        <View style={[styles.badge, { backgroundColor: getStatusBg() }]}>
          <Text style={[styles.statusLabel, { color: getStatusColor() }]}>
            {getStatusLabel()}
          </Text>
        </View>
        {!isWeekend && (
          <TouchableOpacity 
            onPress={(e) => { e.stopPropagation(); onMenuPress(); }} 
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.menuBtn}
          >
            <MoreHorizontal size={20} color={Colors.muted} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  weekend: {
    opacity: 1,
  },
  selected: {
    borderColor: Colors.primary,
    borderWidth: 1,
    backgroundColor: Colors.card,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  dateBlock: {
    width: 48,
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNum: {
    fontSize: 22,
    fontFamily: 'PlusJakartaSans-ExtraBold',
    lineHeight: 24,
  },
  dayName: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans-Bold',
    letterSpacing: 0.5,
    marginTop: -2,
  },
  info: {
    flex: 1,
  },
  leaveText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.muted,
  },
  dateSubText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.muted,
    marginTop: 4,
  },
  timesGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  timeColumn: {
    alignItems: 'flex-start',
  },
  timeVal: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.text,
  },
  timeLabel: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.muted,
  },
  right: {
    alignItems: 'flex-end',
    gap: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  statusLabel: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  menuBtn: {
    padding: 2,
  },
});
