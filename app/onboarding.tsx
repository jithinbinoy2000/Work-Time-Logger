import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Colors } from '@/constants/theme';
import { Camera, ArrowRight, Check } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(1);
  
  // Step 1: Profile
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [dept, setDept] = useState('');
  const [joined, setJoined] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  // Step 2: Settings
  const [officeHrs, setOfficeHrs] = useState('9');
  const [dutyHrs, setDutyHrs] = useState('8');
  const [workDays, setWorkDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      const fileName = asset.uri.split('/').pop() || 'avatar.jpg';
      const newPath = `${(FileSystem as any).documentDirectory}${fileName}`;
      try {
        await FileSystem.copyAsync({ from: asset.uri, to: newPath });
        setAvatarUri(newPath);
      } catch (e) {
        console.error('Failed to copy image to local storage', e);
        setAvatarUri(asset.uri);
      }
    }
  };

  const toggleDay = (day: string) => {
    if (workDays.includes(day)) {
      setWorkDays(workDays.filter(d => d !== day));
    } else {
      setWorkDays([...workDays, day]);
    }
  };

  const handleFinish = async () => {
    try {
      const profile = { name, role, dept, joined, avatarUri };
      const settings = { officeHrs, dutyHrs, workDays };
      await AsyncStorage.setItem('USER_PROFILE', JSON.stringify(profile));
      await AsyncStorage.setItem('USER_SETTINGS', JSON.stringify(settings));
      await AsyncStorage.setItem('ONBOARDING_COMPLETE', 'true');
      router.replace('/(tabs)');
    } catch (e) {
      console.error('Failed to save onboarding data', e);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.stepText}>Step {step} of 2</Text>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${(step / 2) * 100}%` }]} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {step === 1 && (
          <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.stepContent}>
            <Text style={styles.title}>Create Profile</Text>
            <Text style={styles.subtitle}>Tell us a bit about yourself</Text>

            <View style={styles.avatarSection}>
              <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper}>
                <View style={styles.avatarBorder}>
                    <View style={styles.avatar}>
                    {avatarUri ? (
                        <Image source={{ uri: avatarUri }} style={styles.avatarImg} />
                    ) : (
                        <Text style={styles.avatarInitial}>{name ? name[0] : '?'}</Text>
                    )}
                    </View>
                </View>
                <View style={styles.cameraButton}>
                  <Camera size={14} color="#FFF" strokeWidth={2.5} />
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>FULL NAME</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                  placeholderTextColor={Colors.muted}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>ROLE</Text>
                <TextInput
                  style={styles.input}
                  value={role}
                  onChangeText={setRole}
                  placeholder="e.g. Senior Designer"
                  placeholderTextColor={Colors.muted}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>DEPARTMENT</Text>
                <TextInput
                  style={styles.input}
                  value={dept}
                  onChangeText={setDept}
                  placeholder="e.g. Engineering"
                  placeholderTextColor={Colors.muted}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>JOINED DATE</Text>
                <TextInput
                  style={styles.input}
                  value={joined}
                  onChangeText={setJoined}
                  placeholder="e.g. April 2026"
                  placeholderTextColor={Colors.muted}
                />
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.nextButton, !name && styles.buttonDisabled]} 
              onPress={() => setStep(2)}
              disabled={!name}
            >
              <Text style={styles.nextButtonText}>Next Step</Text>
              <ArrowRight size={20} color="#FFF" />
            </TouchableOpacity>
          </Animated.View>
        )}

        {step === 2 && (
          <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.stepContent}>
            <Text style={styles.title}>Work Settings</Text>
            <Text style={styles.subtitle}>Configure your office hours</Text>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>TOTAL TIME IN OFFICE (HRS)</Text>
                <TextInput
                  style={styles.input}
                  value={officeHrs}
                  onChangeText={setOfficeHrs}
                  keyboardType="numeric"
                  placeholder="9"
                  placeholderTextColor={Colors.muted}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>TOTAL DUTY TIME (HRS)</Text>
                <TextInput
                  style={styles.input}
                  value={dutyHrs}
                  onChangeText={setDutyHrs}
                  keyboardType="numeric"
                  placeholder="8"
                  placeholderTextColor={Colors.muted}
                />
              </View>

              <Text style={[styles.label, { marginTop: 10, marginBottom: 15 }]}>WORK DAYS</Text>
              <View style={styles.daysRow}>
                {days.map(day => {
                  const isActive = workDays.includes(day);
                  return (
                    <TouchableOpacity 
                      key={day} 
                      style={[styles.dayChip, isActive && styles.dayChipActive]}
                      onPress={() => toggleDay(day)}
                    >
                      <Text style={[styles.dayText, isActive && styles.dayTextActive]}>{day[0]}</Text>
                      {isActive && <View style={styles.dot} />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.footerButtons}>
              <TouchableOpacity style={styles.backButton} onPress={() => setStep(1)}>
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
                <Text style={styles.nextButtonText}>Finish Setup</Text>
                <Check size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
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
    paddingTop: 20,
    paddingBottom: 10,
  },
  stepText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.muted,
    marginBottom: 8,
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#E2E0DB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 40,
  },
  stepContent: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontFamily: 'PlusJakartaSans-ExtraBold',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.muted,
    marginBottom: 30,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarBorder: {
    padding: 4,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  avatarInitial: {
    fontSize: 32,
    fontFamily: 'PlusJakartaSans-ExtraBold',
    color: '#FFF',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.accent,
    borderWidth: 2,
    borderColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#ECEAE5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  label: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.muted,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  input: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.text,
    padding: 0,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  dayChip: {
    width: 40,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ECEAE5',
  },
  dayChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  dayText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.muted,
  },
  dayTextActive: {
    color: '#FFF',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.accent,
    marginTop: 4,
  },
  nextButton: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 40,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  footerButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 40,
  },
  backButton: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#ECEAE5',
  },
  backButtonText: {
    color: Colors.muted,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  finishButton: {
    flex: 2,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
});
