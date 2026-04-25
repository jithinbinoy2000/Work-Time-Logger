import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { PunchButton } from '@/components/PunchButton';
import { StatCard } from '@/components/StatCard';
import { AlarmClock, Coffee } from 'lucide-react-native';
import { CheckInIcon, CheckOutIcon, TotalHrsIcon } from '@/components/AttendanceIcons';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'OFFICE_TIMER_STATE';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [now, setNow] = useState(new Date());
  const [punchState, setPunchState] = useState<'idle' | 'in' | 'break' | 'out'>('idle');
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<Date | null>(null);
  const [breakStart, setBreakStart] = useState<Date | null>(null);
  const [totalBreak, setTotalBreak] = useState(0); // in ms
  const [elapsed, setElapsed] = useState(0); // in ms
  const [isLoaded, setIsLoaded] = useState(false);
  const [userName, setUserName] = useState('Jithin');

  // Load state on mount
  useEffect(() => {
    const loadState = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setPunchState(parsed.punchState);
          if (parsed.checkInTime) setCheckInTime(new Date(parsed.checkInTime));
          if (parsed.checkOutTime) setCheckOutTime(new Date(parsed.checkOutTime));
          if (parsed.breakStart) setBreakStart(new Date(parsed.breakStart));
          setTotalBreak(parsed.totalBreak || 0);
        }

        const profileSaved = await AsyncStorage.getItem('USER_PROFILE');
        if (profileSaved) {
          const prof = JSON.parse(profileSaved);
          if (prof.name) setUserName(prof.name.split(' ')[0]);
        }
      } catch (e) {
        console.error('Failed to load state', e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadState();
  }, []);

  // Save state on change
  useEffect(() => {
    if (!isLoaded) return;
    const saveState = async () => {
      try {
        const state = {
          punchState,
          checkInTime: checkInTime?.toISOString(),
          checkOutTime: checkOutTime?.toISOString(),
          breakStart: breakStart?.toISOString(),
          totalBreak,
        };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        console.error('Failed to save state', e);
      }
    };
    saveState();
  }, [punchState, checkInTime, checkOutTime, breakStart, totalBreak, isLoaded]);

  useEffect(() => {
    const t = setInterval(() => {
      const d = new Date();
      setNow(d);
      
      if (checkInTime) {
        if (punchState === 'in') {
          setElapsed(Date.now() - checkInTime.getTime() - totalBreak);
        } else if (punchState === 'break' && breakStart) {
          // Live update for display
        } else {
            setElapsed(Date.now() - checkInTime.getTime() - totalBreak);
        }
      }
    }, 1000);
    return () => clearInterval(t);
  }, [punchState, checkInTime, totalBreak, breakStart]);

  const fmtTime = (d: Date) => {
    let h = d.getHours();
    const m = d.getMinutes().toString().padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12;
    return `${h}:${m} ${ampm}`;
  };

  const fmtElapsed = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return `${h}h ${m}m`;
  };

  const handlePunchPress = () => {
    if (punchState === 'idle') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setCheckInTime(new Date());
      setPunchState('in');
    } else if (punchState === 'in') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setBreakStart(new Date());
      setPunchState('break');
    } else if (punchState === 'break') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      if (breakStart) {
        setTotalBreak(prev => prev + (Date.now() - breakStart.getTime()));
      }
      setBreakStart(null);
      setPunchState('in');
    }
  };

  const handleHoldComplete = () => {
    setCheckOutTime(new Date());
    if (punchState === 'break' && breakStart) {
      setTotalBreak(prev => prev + (Date.now() - breakStart.getTime()));
    }
    setPunchState('out');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const getGreeting = () => {
    const hour = now.getHours();
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    if (hour >= 17 && hour < 21) return 'Good evening';
    return 'Good night';
  };

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const estMs = checkInTime ? checkInTime.getTime() + 9 * 3600 * 1000 : 0;
  const remaining = estMs - Date.now();
  const isDone = remaining <= 0;

  if (!isLoaded) return null;

  return (
    <View style={styles.container}>
      {/* Static Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View>
          <Text style={styles.headerSub}>{getGreeting()}! Mark your attendance</Text>
          <Text style={styles.headerTitle}>Hey {userName}!</Text>
        </View>
        <View style={styles.avatarWrapper}>
          <View style={styles.avatar}>
             <Text style={styles.avatarText}>{userName[0]}</Text>
          </View>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.focalSection}>
          <View style={styles.clockContainer}>
            <Text style={styles.clockTime}>
              {now.getHours().toString().padStart(2, '0')}:{now.getMinutes().toString().padStart(2, '0')}
            </Text>
            <Text style={styles.clockDate}>
              {months[now.getMonth()]} {now.getDate()}, {now.getFullYear()} · {days[now.getDay()]}
            </Text>
          </View>

          <View style={styles.punchWrapper}>
            <PunchButton 
                status={punchState} 
                onPress={handlePunchPress} 
                onHoldComplete={handleHoldComplete} 
            />
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <StatCard 
              label="Check In" 
              value={checkInTime ? fmtTime(checkInTime) : '--:--'} 
              Icon={CheckInIcon} 
            />
            <StatCard 
              label="Break Time" 
              value={
                punchState === 'break' && breakStart 
                  ? fmtElapsed(totalBreak + (Date.now() - breakStart.getTime())) 
                  : (totalBreak > 0 ? fmtElapsed(totalBreak) : '--:--')
              } 
              Icon={CheckOutIcon} 
            />
            <StatCard 
              label="Total Hrs" 
              value={checkInTime && punchState !== 'idle' ? fmtElapsed(elapsed) : '--:--'} 
              Icon={TotalHrsIcon} 
              isLast 
            />
          </View>

          {/* Banners Area */}
          <View style={styles.bannersArea}>
            {(punchState === 'in' || punchState === 'break') && (
                <View style={styles.bannerContainer}>
                <View style={[styles.banner, isDone && styles.bannerDone]}>
                    <View style={styles.bannerLeft}>
                    <View style={styles.bannerIconWrapper}>
                        <AlarmClock size={18} color={Colors.primary} strokeWidth={2.2} />
                    </View>
                    <View>
                        <Text style={styles.bannerLabel}>Est. Punch-Out</Text>
                        <Text style={styles.bannerValue}>{fmtTime(new Date(estMs))}</Text>
                    </View>
                    </View>
                <View style={styles.bannerRight}>
                  <Text style={styles.bannerLabel}>{isDone ? 'Overtime' : 'Remaining'}</Text>
                  <Text style={[styles.bannerTime, isDone && styles.textError]}>
                    {isDone ? `+${fmtElapsed(Math.abs(remaining))}` : fmtElapsed(remaining)}
                  </Text>
                </View>
                </View>
                </View>
            )}

            {punchState === 'break' && (
                <View style={styles.breakBannerContainer}>
                <View style={styles.breakBanner}>
                    <View style={styles.breakIconWrapper}>
                    <Coffee size={16} color={Colors.accent} strokeWidth={2.2} />
                    </View>
                    <View>
                    <Text style={styles.breakTitle}>On Break</Text>
                    <Text style={styles.breakSub}>Hold button 5s to punch out</Text>
                    </View>
                </View>
                </View>
            )}
          </View>
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
    paddingHorizontal: 22,
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.background,
    zIndex: 10,
  },
  headerSub: {
    fontSize: 11,
    color: Colors.muted,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans-ExtraBold',
    color: Colors.text,
    marginTop: 1,
  },
  avatarWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.primary,
    padding: 2,
  },
  avatar: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 120,
  },
  focalSection: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
  },
  clockContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  clockTime: {
    fontSize: 64,
    fontFamily: 'PlusJakartaSans-ExtraBold',
    color: Colors.text,
    letterSpacing: -2,
    lineHeight: 72,
  },
  clockDate: {
    fontSize: 12,
    color: Colors.muted,
    fontFamily: 'PlusJakartaSans-Medium',
    marginTop: 2,
    letterSpacing: 0.4,
  },
  punchWrapper: {
    marginVertical: 15,
  },
  statsRow: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginTop: 10,
    marginBottom: 24,
  },
  bannersArea: {
      width: '100%',
      gap: 12,
  },
  bannerContainer: {
    width: '100%',
    paddingHorizontal: 24,
  },
  banner: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    paddingVertical: 13,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ECEAE5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  bannerDone: {
    backgroundColor: Colors.primary + '12',
    borderColor: Colors.primary + '40',
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bannerIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerLabel: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.muted,
    marginBottom: 1,
  },
  bannerValue: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-ExtraBold',
    color: Colors.primary,
  },
  bannerRight: {
    alignItems: 'flex-end',
  },
  bannerTime: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-ExtraBold',
    color: Colors.text,
  },
  textError: {
    color: Colors.error,
  },
  breakBannerContainer: {
    width: '100%',
    paddingHorizontal: 24,
  },
  breakBanner: {
    backgroundColor: Colors.accent + '18',
    borderRadius: 14,
    paddingVertical: 11,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.accent + '44',
  },
  breakIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.accent + '25',
    alignItems: 'center',
    justifyContent: 'center',
  },
  breakTitle: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.accent,
  },
  breakSub: {
    fontSize: 10,
    color: Colors.muted,
    fontFamily: 'PlusJakartaSans-Regular',
  },
});
