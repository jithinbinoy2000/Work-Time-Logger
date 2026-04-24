import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { Camera, ChevronRight } from 'lucide-react-native';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();

  const [name, setName] = useState('Jithin Binoy');

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>Your personal information</Text>
        </View>

        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Text style={styles.avatarInitial}>{name[0]}</Text>
            </View>
            <TouchableOpacity style={styles.cameraButton}>
              <Camera size={14} color="#FFF" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
          <Text style={styles.avatarHint}>Tap camera to change photo</Text>
        </View>

        {/* Form */}
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

          {/* Info Rows */}
          {[
            { label: 'ROLE', val: 'Employee' },
            { label: 'DEPARTMENT', val: 'General' },
            { label: 'JOINED', val: 'April 2026' },
          ].map(row => (
            <View key={row.label} style={styles.infoRow}>
              <Text style={styles.infoLabel}>{row.label}</Text>
              <Text style={styles.infoValue}>{row.val}</Text>
            </View>
          ))}

          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
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
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 20,
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
  avatarSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 5,
  },
  avatarInitial: {
    fontSize: 36,
    fontFamily: 'PlusJakartaSans-ExtraBold',
    color: '#FFF',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.accent,
    borderWidth: 2,
    borderColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarHint: {
    fontSize: 12,
    color: Colors.muted,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  form: {
    paddingHorizontal: 24,
  },
  inputGroup: {
    backgroundColor: Colors.card,
    borderRadius: 22,
    padding: 20,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
  label: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.muted,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  input: {
    fontSize: 17,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.text,
    padding: 0,
  },
  infoRow: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.muted,
    letterSpacing: 0.4,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.text,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 4,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Bold',
  },
});
