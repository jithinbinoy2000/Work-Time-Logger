import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { AttendanceItem, AttendanceStatus } from '@/components/AttendanceItem';

interface AttendanceData {
  id: number;
  date: Date;
  dayNum: number;
  dayName: string;
  month: string;
  isWeekend: boolean;
  status: AttendanceStatus;
  checkIn: string | null;
  checkOut: string | null;
  totalHrs: string | null;
  leaveType: AttendanceStatus | null;
}

function buildAttendanceData(): AttendanceData[] {
  const today = new Date();
  const data: AttendanceData[] = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dow = d.getDay();
    const isWeekend = dow === 0 || dow === 6;
    
    data.push({
      id: i,
      date: d,
      dayNum: d.getDate(),
      dayName: dayNames[dow],
      month: monthNames[d.getMonth()],
      isWeekend,
      status: isWeekend ? 'weekend' : 'present',
      checkIn: isWeekend ? null : '09:00 AM',
      checkOut: isWeekend ? null : (i === 0 ? null : '06:00 PM'),
      totalHrs: isWeekend ? null : (i === 0 ? null : '09:00'),
      leaveType: isWeekend ? 'weekend' : null,
    });
  }
  return data;
}

export default function AttendanceScreen() {
  const insets = useSafeAreaInsets();

  const [data, setData] = useState<AttendanceData[]>(buildAttendanceData());
  const [showMenuId, setShowMenuId] = useState<number | null>(null);

  const setLeave = (id: number, type: AttendanceStatus | null) => {
    setData(prev => prev.map(d => d.id === id ? { ...d, leaveType: type, status: type || 'present' } : d));
    setShowMenuId(null);
  };

  const presentCount = data.filter(d => d.status === 'present').length;
  const leaveCount = data.filter(d => d.status === 'full-leave' || d.status === 'half-leave').length;
  const weekendCount = data.filter(d => d.isWeekend).length;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.title}>Attendance</Text>
        <Text style={styles.subtitle}>Last 30 days overview</Text>
      </View>

      {/* Summary chips */}
      <View style={styles.summaryRow}>
        {[
          { label: 'Present', count: presentCount, color: Colors.primary },
          { label: 'Leave', count: leaveCount, color: Colors.accent },
          { label: 'Weekend', count: weekendCount, color: Colors.muted },
        ].map(c => (
          <View key={c.label} style={styles.summaryChip}>
            <Text style={[styles.summaryCount, { color: c.color }]}>{c.count}</Text>
            <Text style={styles.summaryLabel}>{c.label}</Text>
          </View>
        ))}
      </View>

      {/* List */}
      <ScrollView contentContainerStyle={styles.listContent}>
        {[...data].reverse().map(item => (
          <View key={item.id}>
            <AttendanceItem
              dayNum={item.dayNum}
              dayName={item.dayName}
              month={item.month}
              checkIn={item.checkIn}
              checkOut={item.checkOut}
              totalHrs={item.totalHrs}
              isWeekend={item.isWeekend}
              leaveType={item.leaveType}
              onMenuPress={() => setShowMenuId(showMenuId === item.id ? null : item.id)}
            />
            
            {showMenuId === item.id && (
              <View style={styles.dropdown}>
                <TouchableOpacity 
                  style={styles.dropdownItem} 
                  onPress={() => setLeave(item.id, 'full-leave')}
                >
                  <Text style={[styles.dropdownText, { color: Colors.accent }]}>Mark Full Day Leave</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.dropdownItem} 
                  onPress={() => setLeave(item.id, 'half-leave')}
                >
                  <Text style={[styles.dropdownText, { color: '#E07070' }]}>Mark Half Day Leave</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.dropdownItem, styles.noBorder]} 
                  onPress={() => setLeave(item.id, null)}
                >
                  <Text style={[styles.dropdownText, { color: Colors.primary }]}>Mark as Present</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
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
    paddingTop: 10,
    paddingBottom: 14,
  },
  title: {
    fontSize: 22,
    fontFamily: 'PlusJakartaSans-ExtraBold',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.muted,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 24,
    paddingBottom: 14,
  },
  summaryChip: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  summaryCount: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans-ExtraBold',
  },
  summaryLabel: {
    fontSize: 10,
    color: Colors.muted,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  dropdown: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    marginTop: -4,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 4,
    overflow: 'hidden',
    zIndex: 10,
  },
  dropdownItem: {
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  dropdownText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
});
