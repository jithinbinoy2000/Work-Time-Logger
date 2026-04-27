import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '@/constants/theme';
import { AttendanceItem, AttendanceStatus } from '@/components/AttendanceItem';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, Calendar, Clock, Coffee, LogIn, LogOut } from 'lucide-react-native';
import { Dimensions, Platform } from 'react-native';
import { CalendarPicker } from '@/components/CalendarPicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function AttendanceScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [currentMonth, setCurrentMonth] = useState('April 2026');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [menuVisible, setMenuVisible] = useState<number | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [historyLogs, setHistoryLogs] = useState<any[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      const loadHistory = async () => {
        try {
          const hist = await AsyncStorage.getItem('ATTENDANCE_HISTORY');
          if (hist) setHistoryLogs(JSON.parse(hist));
        } catch (e) {}
      };
      loadHistory();
    }, [])
  );

  // Hide tab bar when details are open
  React.useEffect(() => {
    navigation.setOptions({
      tabBarStyle: { display: selectedDay ? 'none' : 'flex' }
    });
  }, [selectedDay, navigation]);

  const summary = [
    { label: 'Present', count: '18', color: '#1B4D35' },
    { label: 'Absent', count: '02', color: '#E07070' },
    { label: 'Leaves', count: '01', color: '#C9A55A' },
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
    logs?: Array<{ time: string; type: 'in' | 'out' | 'break-start' | 'break-end'; label: string }>;
    breakTime?: string;
  }> = [
    { dayNum: 30, dayName: 'Thursday', month: 'Apr', checkIn: null, checkOut: null, totalHrs: null, isWeekend: false, leaveType: null },
    { dayNum: 29, dayName: 'Wednesday', month: 'Apr', checkIn: null, checkOut: null, totalHrs: null, isWeekend: false, leaveType: null },
    { dayNum: 28, dayName: 'Tuesday', month: 'Apr', checkIn: null, checkOut: null, totalHrs: null, isWeekend: false, leaveType: null },
    { 
      dayNum: 27, dayName: 'Monday', month: 'Apr', 
      checkIn: '09:00 AM', checkOut: null, totalHrs: null, 
      isWeekend: false, leaveType: null,
      logs: [{ time: '09:00 AM', type: 'in', label: 'Punched In' }]
    },
    { dayNum: 26, dayName: 'Sunday', month: 'Apr', checkIn: null, checkOut: null, totalHrs: null, isWeekend: true, leaveType: 'weekend' },
    { dayNum: 25, dayName: 'Saturday', month: 'Apr', checkIn: null, checkOut: null, totalHrs: null, isWeekend: true, leaveType: 'weekend' },
    { 
      dayNum: 24, dayName: 'Friday', month: 'Apr', 
      checkIn: '09:00 AM', checkOut: '06:00 PM', totalHrs: '9.0', 
      isWeekend: false, leaveType: null,
      breakTime: '00:45',
      logs: [
        { time: '09:00 AM', type: 'in', label: 'Punched In' },
        { time: '01:00 PM', type: 'break-start', label: 'Break Started' },
        { time: '01:45 PM', type: 'break-end', label: 'Break Ended' },
        { time: '06:00 PM', type: 'out', label: 'Punched Out' },
      ]
    },
    { 
      dayNum: 23, dayName: 'Thursday', month: 'Apr', 
      checkIn: '08:55 AM', checkOut: '06:10 PM', totalHrs: '9.2', 
      isWeekend: false, leaveType: null,
      breakTime: '01:00',
      logs: [
        { time: '08:55 AM', type: 'in', label: 'Punched In' },
        { time: '01:00 PM', type: 'break-start', label: 'Break Started' },
        { time: '02:00 PM', type: 'break-end', label: 'Break Ended' },
        { time: '06:10 PM', type: 'out', label: 'Punched Out' },
      ]
    },
    { 
      dayNum: 22, dayName: 'Wednesday', month: 'Apr', 
      checkIn: '09:10 AM', checkOut: '06:05 PM', totalHrs: '8.9', 
      isWeekend: false, leaveType: null 
    },
    { 
      dayNum: 21, dayName: 'Tuesday', month: 'Apr', 
      checkIn: null, checkOut: null, totalHrs: null, 
      isWeekend: false, leaveType: 'holiday' 
    },
    { 
      dayNum: 20, dayName: 'Monday', month: 'Apr', 
      checkIn: '09:05 AM', checkOut: '06:15 PM', totalHrs: '9.1', 
      isWeekend: false, leaveType: null 
    },
    { dayNum: 19, dayName: 'Sunday', month: 'Apr', checkIn: null, checkOut: null, totalHrs: null, isWeekend: true, leaveType: 'weekend' },
    { dayNum: 18, dayName: 'Saturday', month: 'Apr', checkIn: null, checkOut: null, totalHrs: null, isWeekend: true, leaveType: 'weekend' },
    { dayNum: 17, dayName: 'Friday', month: 'Apr', checkIn: '08:50 AM', checkOut: '05:45 PM', totalHrs: '8.9', isWeekend: false, leaveType: null },
  ];

  // Merge historyLogs with default data
  const mergedData = data.map(day => {
    const dDate = new Date(2026, 3, day.dayNum); // Mocked for April 2026
    const dateStr = dDate.toISOString().split('T')[0];
    const log = historyLogs.find(h => h.date === dateStr);
    
    if (log) {
      const parseTime = (isoStr: string) => {
        const d = new Date(isoStr);
        let h = d.getHours();
        const m = d.getMinutes().toString().padStart(2, '0');
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        return `${h}:${m} ${ampm}`;
      };

      const hrs = log.totalMs ? (log.totalMs / (1000 * 60 * 60)).toFixed(1) : null;
      const bHrs = log.totalBreakMs ? (log.totalBreakMs / (1000 * 60 * 60)).toFixed(1) : null;

      return {
        ...day,
        checkIn: log.checkIn ? parseTime(log.checkIn) : day.checkIn,
        checkOut: log.checkOut ? parseTime(log.checkOut) : day.checkOut,
        totalHrs: hrs || day.totalHrs,
        breakTime: bHrs || day.breakTime,
        logs: log.logs && log.logs.length > 0 ? log.logs : day.logs
      };
    }
    return day;
  });

  return (
    <View style={styles.container}>
      {/* Static Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>Attendance</Text>
            <Text style={styles.subtitle}>Last 30 days overview</Text>
          </View>
          <TouchableOpacity 
            style={styles.calendarBtn}
            onPress={() => setShowDatePicker(true)}
          >
            <Calendar size={18} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Summary Chips */}
        <View style={styles.summaryRow}>
          {summary.map((s) => (
            <View key={s.label} style={styles.summaryCard}>
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
          {mergedData.map((item, index) => (
            <View key={index}>
              <AttendanceItem
                {...item}
                isSelected={selectedDay === item.dayNum}
                onPress={() => {
                  if (item.logs && item.logs.length > 0) {
                    setSelectedDay(selectedDay === item.dayNum ? null : item.dayNum);
                  }
                }}
                onMenuPress={() => setMenuVisible(menuVisible === item.dayNum ? null : item.dayNum)}
              />
              
              {menuVisible === item.dayNum && (
                <View style={styles.dropdown}>
                  {[
                    { label: 'Mark Full Day Leave', type: 'full-leave' as AttendanceStatus, color: '#C9A55A' },
                    { label: 'Mark Half Day Leave', type: 'half-leave' as AttendanceStatus, color: Colors.error },
                    { label: 'Mark as Holiday', type: 'holiday' as AttendanceStatus, color: Colors.primary },
                    { label: 'Mark as Present', type: 'present' as AttendanceStatus, color: Colors.primary },
                  ].map((opt) => (
                    <TouchableOpacity 
                      key={opt.label} 
                      style={styles.dropdownItem}
                      onPress={() => {
                        setMenuVisible(null);
                      }}
                    >
                      <Text style={[styles.dropdownText, { color: opt.color }]}>{opt.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {selectedDay && (() => {
        const item = mergedData.find(d => d.dayNum === selectedDay);
        if (!item || !item.logs) return null;
        return (
          <>
            <TouchableOpacity 
              activeOpacity={1} 
              style={styles.backdrop} 
              onPress={() => setSelectedDay(null)} 
            />
            <View style={styles.infoSection}>
              <View style={styles.infoHandle} />
              <View style={styles.infoContent}>
                <View style={styles.infoHeader}>
                  <View>
                    <Text style={styles.infoTitle}>Activity Details</Text>
                    <Text style={styles.infoSubtitle}>Viewing logs for {item.dayName}, {item.month} {item.dayNum}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedDay(null)} style={styles.closeBtn}>
                    <Text style={styles.closeBtnText}>Close</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.infoGrid}>
                <View style={styles.infoCard}>
                  <Clock size={16} color={Colors.primary} />
                  <View>
                    <Text style={styles.infoCardLabel}>Total Work</Text>
                    <Text style={styles.infoCardValue}>{item.totalHrs || '--'} hrs</Text>
                  </View>
                </View>
                <View style={styles.infoCard}>
                  <Coffee size={16} color={Colors.accent} />
                  <View>
                    <Text style={styles.infoCardLabel}>Break Time</Text>
                    <Text style={styles.infoCardValue}>{item.breakTime || '--'} hrs</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.logsTitle}>Logs & Activity</Text>
              <View style={styles.logsList}>
                {item.logs.map((log: any, idx: number) => (
                  <View key={idx} style={styles.logItem}>
                    <View style={styles.logLeft}>
                      <View style={[styles.logDot, { backgroundColor: log.type === 'in' || log.type === 'break-end' ? Colors.primary : Colors.accent }]} />
                      {idx !== item.logs.length - 1 && <View style={styles.logLine} />}
                    </View>
                    <View style={styles.logRight}>
                      <Text style={styles.logLabel}>{log.label}</Text>
                      <Text style={styles.logTime}>{log.time}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
          </>
        );
      })()}

      <CalendarPicker
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        currentDate={date}
        attendanceData={mergedData}
        onDateSelect={(selectedDate) => {
          setDate(selectedDate);
          const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
          setCurrentMonth(`${monthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`);
          
          // Show details if log exists for this day
          const dayNum = selectedDate.getDate();
          const hasLogs = mergedData.find(d => d.dayNum === dayNum && d.month === 'Apr'); // Simplification for demo
          if (hasLogs) {
            setSelectedDay(dayNum);
          }
        }}
      />
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
  subtitle: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.muted,
    marginTop: 2,
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
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 15,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
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
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 99,
  },
  infoSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 20,
    zIndex: 100,
  },
  infoHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E2E0DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
  },
  infoContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans-ExtraBold',
    color: Colors.text,
  },
  infoSubtitle: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.muted,
    marginTop: 2,
  },
  closeBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: Colors.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ECEAE5',
  },
  closeBtnText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.muted,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  infoCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.background,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ECEAE5',
  },
  infoCardLabel: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.muted,
  },
  infoCardValue: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans-ExtraBold',
    color: Colors.text,
  },
  logsTitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-ExtraBold',
    color: Colors.text,
    marginBottom: 16,
  },
  logsList: {
    gap: 0,
  },
  logItem: {
    flexDirection: 'row',
    height: 60,
    gap: 16,
  },
  logLeft: {
    alignItems: 'center',
    width: 20,
  },
  logDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    zIndex: 2,
    marginTop: 6,
  },
  logLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E2E0DB',
    marginTop: -4,
    marginBottom: -4,
  },
  logRight: {
    flex: 1,
    paddingTop: 2,
  },
  logLabel: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.text,
  },
  logTime: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.muted,
    marginTop: 1,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginTop: -8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ECEAE5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans-Bold',
  },
});
