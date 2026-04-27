import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Colors } from '@/constants/theme';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

interface CalendarPickerProps {
  visible: boolean;
  onClose: () => void;
  onDateSelect: (date: Date) => void;
  currentDate: Date;
  attendanceData?: Array<{ dayNum: number; month: string; leaveType: string | null; isWeekend: boolean }>;
}

export function CalendarPicker({ visible, onClose, onDateSelect, currentDate, attendanceData = [] }: CalendarPickerProps) {
  const [viewDate, setViewDate] = useState(new Date(currentDate));

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const prevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const daysInMonth = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());
  const firstDay = getFirstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());

  const days = [];
  // Add empty slots for days of the previous month
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  // Add days of the current month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const handleDatePress = (day: number) => {
    const selectedDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    onDateSelect(selectedDate);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={prevMonth} style={styles.navBtn}>
              <Text style={styles.navText}>« Prev</Text>
            </TouchableOpacity>
            
            <Text style={styles.monthTitle}>
              {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
            </Text>

            <TouchableOpacity onPress={nextMonth} style={styles.navBtn}>
              <Text style={styles.navText}>Next »</Text>
            </TouchableOpacity>
          </View>

          {/* Day Names */}
          <View style={styles.dayNamesRow}>
            {dayNames.map(day => (
              <Text key={day} style={styles.dayNameText}>{day}</Text>
            ))}
          </View>

          {/* Days Grid */}
          <View style={styles.grid}>
            {days.map((day, index) => {
              if (!day) return <View key={index} style={styles.dayCell} />;

              const today = new Date();
              const isToday = day === today.getDate() && 
                             viewDate.getMonth() === today.getMonth() && 
                             viewDate.getFullYear() === today.getFullYear();

              const isSelected = day === currentDate.getDate() && 
                               viewDate.getMonth() === currentDate.getMonth() && 
                               viewDate.getFullYear() === currentDate.getFullYear();
              
              // Find status for this day
              const monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              const status = attendanceData.find(d => 
                d.dayNum === day && d.month === monthNamesShort[viewDate.getMonth()]
              );

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayCell, 
                    isSelected && styles.selectedCell,
                    isToday && !isSelected && styles.todayCell
                  ]}
                  onPress={() => handleDatePress(day)}
                >
                  <Text style={[
                    styles.dayText, 
                    isSelected && styles.selectedDayText,
                    isToday && !isSelected && styles.todayText
                  ]}>
                    {day}
                  </Text>
                  {status && status.leaveType && (
                    <View style={[
                      styles.statusDot, 
                      { backgroundColor: status.leaveType === 'full-leave' ? Colors.accent : status.leaveType === 'half-leave' ? '#E07070' : Colors.primary }
                    ]} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  navBtn: {
    padding: 5,
  },
  navText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.primary,
  },
  monthTitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-ExtraBold',
    color: Colors.text,
  },
  dayNamesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  dayNameText: {
    width: 35,
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.muted,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  dayCell: {
    width: '14.28%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  selectedCell: {
    backgroundColor: Colors.primary,
  },
  dayText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.text,
  },
  selectedDayText: {
    color: '#FFF',
    fontFamily: 'PlusJakartaSans-Bold',
  },
  todayCell: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  todayText: {
    color: Colors.primary,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  statusDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    bottom: 6,
  },
  emptyText: {
    color: 'transparent',
  },
});
