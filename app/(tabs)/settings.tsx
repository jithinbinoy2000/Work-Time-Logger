import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Pressable, Alert } from 'react-native';
import { Colors } from '@/constants/theme';
import { ChevronRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, withSpring, interpolateColor, useSharedValue } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

function CustomToggle({ value, onValueChange }: { value: boolean, onValueChange: (v: boolean) => void }) {
  const translateX = useSharedValue(value ? 20 : 0);

  React.useEffect(() => {
    translateX.value = withSpring(value ? 20 : 0, { damping: 15, stiffness: 200 });
  }, [value]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const backgroundStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      translateX.value,
      [0, 20],
      ['#D0D0D0', Colors.primary]
    );
    return { backgroundColor };
  });

  return (
    <Pressable onPress={() => onValueChange(!value)}>
      <Animated.View style={[styles.toggleContainer, backgroundStyle]}>
        <Animated.View style={[styles.toggleThumb, animatedStyle]} />
      </Animated.View>
    </Pressable>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const [notifs, setNotifs] = useState(true);
  const [dark, setDark] = useState(false);
  const [reminders, setReminders] = useState(true);

  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "Are you sure you want to reset all attendance records and punch state? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Clear", 
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('OFFICE_TIMER_STATE');
              Alert.alert("Success", "All local data has been cleared.");
              router.replace('/');
            } catch (e) {
              Alert.alert("Error", "Failed to clear data.");
            }
          }
        }
      ]
    );
  };

  const sections = [
    {
      title: 'Notifications',
      items: [
        { label: 'Push Notifications', sub: 'Receive attendance reminders', type: 'toggle', value: notifs, setter: setNotifs },
        { label: 'Daily Reminders', sub: 'Reminder to punch in/out', type: 'toggle', value: reminders, setter: setReminders },
      ]
    },
    {
      title: 'Appearance',
      items: [
        { label: 'Dark Mode', sub: 'Switch to dark theme', type: 'toggle', value: dark, setter: setDark },
      ]
    },
    {
      title: 'General',
      items: [
        { label: 'Work Hours', sub: 'Set your default shift hours', type: 'arrow' },
        { label: 'Week Start', sub: 'Configure work week start day', type: 'arrow' },
        { label: 'Language', sub: 'English (US)', type: 'arrow' },
      ]
    },
    {
      title: 'About',
      items: [
        { label: 'Version', sub: '1.0.0', type: 'text' },
        { label: 'Privacy Policy', sub: '', type: 'arrow' },
        { label: 'Terms of Service', sub: '', type: 'arrow' },
      ]
    },
  ];

  return (
    <View style={styles.container}>
      {/* Static Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Manage your preferences</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {sections.map(sec => (
            <View key={sec.title} style={styles.section}>
              <Text style={styles.sectionTitle}>{sec.title.toUpperCase()}</Text>
              <View style={styles.sectionCard}>
                {sec.items.map((item, i) => (
                  <View key={item.label} style={[styles.item, i < sec.items.length - 1 && styles.itemBorder]}>
                    <View style={styles.itemLeft}>
                      <Text style={styles.itemLabel}>{item.label}</Text>
                      {item.sub ? <Text style={styles.itemSub}>{item.sub}</Text> : null}
                    </View>
                    {item.type === 'toggle' && (
                      <CustomToggle
                        value={item.value!}
                        onValueChange={item.setter!}
                      />
                    )}
                    {item.type === 'arrow' && (
                      <ChevronRight size={18} color={Colors.muted} />
                    )}
                  </View>
                ))}
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.clearButton} onPress={handleClearData}>
            <Text style={styles.clearButtonText}>Clear All Data</Text>
          </TouchableOpacity>
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
    paddingBottom: 20,
    backgroundColor: Colors.background,
    zIndex: 10,
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
  scrollContent: {
    paddingBottom: 120,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans-ExtraBold',
    color: Colors.muted,
    letterSpacing: 1,
    marginBottom: 8,
    paddingLeft: 4,
  },
  sectionCard: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    overflow: 'hidden',
  },
  item: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F0',
  },
  itemLeft: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.text,
  },
  itemSub: {
    fontSize: 11,
    color: Colors.muted,
    fontFamily: 'PlusJakartaSans-Medium',
    marginTop: 2,
  },
  toggleContainer: {
    width: 46,
    height: 26,
    borderRadius: 13,
    padding: 3,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  clearButton: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#FFDDDD',
    backgroundColor: '#FFF5F5',
    alignItems: 'center',
    marginTop: 10,
  },
  clearButtonText: {
    color: '#E07070',
    fontSize: 15,
    fontFamily: 'PlusJakartaSans-Bold',
  },
});
