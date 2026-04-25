import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/theme';
import { AttendanceItem, AttendanceStatus } from '@/components/AttendanceItem';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react-native';

export default function AttendanceScreen() {
  const insets = useSafeAreaInsets();
  const [currentMonth, setCurrentMonth] = useState('April 2026');

  const summary = [
    { label: 'Present', count: '18', color: Colors.primary },
    { label: 'Absent', count: '02', color: Colors.error },
    { label: 'Leaves', count: '01', color: Colors.accent },
  ];

  const data: Array<{
    dayNum: number;
    dayName: string;
    month: string;
    checkIn: string | null;
    checkOut: string | null;
    totalHrs: string | null;
    isWeekend: boolean;
    leaveType: AttendanceStatus | null;
  }> = [
    { dayNum: 24, dayName: 'Friday', month: 'Apr', checkIn: '09:00 AM', checkOut: null, totalHrs: null, isWeekend: false, leaveType: null },
    { dayNum: 23, dayName: 'Thursday', month: 'Apr', checkIn: '08:55 AM', checkOut: '06:10 PM', totalHrs: '9.2', isWeekend: false, leaveType: null },
    { dayNum: 22, dayName: 'Wednesday', month: 'Apr', checkIn: '09:10 AM', checkOut: '06:05 PM', totalHrs: '8.9', isWeekend: false, leaveType: null },
    { dayNum: 21, dayName: 'Tuesday', month: 'Apr', checkIn: null, checkOut: null, totalHrs: null, isWeekend: false, leaveType: 'full-leave' },
    { dayNum: 20, dayName: 'Monday', month: 'Apr', checkIn: '09:05 AM', checkOut: '06:15 PM', totalHrs: '9.1', isWeekend: false, leaveType: null },
    { dayNum: 19, dayName: 'Sunday', month: 'Apr', checkIn: null, checkOut: null, totalHrs: null, isWeekend: true, leaveType: 'weekend' },
    { dayNum: 18, dayName: 'Saturday', month: 'Apr', checkIn: null, checkOut: null, totalHrs: null, isWeekend: true, leaveType: 'weekend' },
    { dayNum: 17, dayName: 'Friday', month: 'Apr', checkIn: '08:50 AM', checkOut: '05:45 PM', totalHrs: '8.9', isWeekend: false, leaveType: null },
  ];

  return (
    <View style={styles.container}>
      {/* Static Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Attendance</Text>
          <TouchableOpacity style={styles.calendarBtn}>
            <Calendar size={18} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Month Selector */}
        <View style={styles.monthSelector}>
          <TouchableOpacity>
            <ChevronLeft size={20} color={Colors.muted} />
          </TouchableOpacity>
          <Text style={styles.monthText}>{currentMonth}</Text>
          <TouchableOpacity>
            <ChevronRight size={20} color={Colors.muted} />
          </TouchableOpacity>
        </View>

        {/* Summary Row */}
        <View style={styles.summaryRow}>
          {summary.map(s => (
            <View key={s.label} style={styles.summaryItem}>
              <Text style={[styles.summaryCount, { color: s.color }]}>{s.count}</Text>
              <Text style={styles.summaryLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Scrollable List */}
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.listContainer}>
          {data.map((item, index) => (
            <AttendanceItem
              key={index}
              {...item}
              onMenuPress={() => {}}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 24,
    backgroundColor: Colors.background,
    zIndex: 10,
    paddingBottom: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontFamily: 'PlusJakartaSans-ExtraBold',
    color: Colors.text,
  },
  calendarBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ECEAE5',
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 15,
  },
  monthText: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.text,
  },
  summaryRow: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 18,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#ECEAE5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryCount: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-ExtraBold',
  },
  summaryLabel: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.muted,
    marginTop: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  listContainer: {
    paddingHorizontal: 24,
    paddingTop: 10,
  },
});
