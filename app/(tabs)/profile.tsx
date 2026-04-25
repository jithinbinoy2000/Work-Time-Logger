import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { Colors } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { 
    Camera as CameraIcon, 
    MapPin as MapPinIcon, 
    Briefcase as BriefcaseIcon, 
    Mail as MailIcon, 
    Phone as PhoneIcon, 
    Calendar as CalendarIcon, 
    Edit3 as EditIcon, 
    Check as CheckIcon, 
    X as XIcon 
} from 'lucide-react-native';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Jithin Binoy',
    role: 'Senior Product Designer',
    dept: 'Design Team',
    joined: 'Jan 2024',
    email: 'jithin@company.com',
    phone: '+91 98765 43210',
    location: 'Bangalore, India',
    avatarUri: null as string | null
  });

  const [tempProfile, setTempProfile] = useState({ ...profile });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const saved = await AsyncStorage.getItem('USER_PROFILE');
        if (saved) {
          const parsed = JSON.parse(saved);
          setProfile(prev => ({ ...prev, ...parsed }));
          setTempProfile(prev => ({ ...prev, ...parsed }));
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadProfile();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      if (isEditing) {
          setTempProfile(p => ({ ...p, avatarUri: result.assets[0].uri }));
      } else {
          const newProfile = { ...profile, avatarUri: result.assets[0].uri };
          setProfile(newProfile);
          await AsyncStorage.setItem('USER_PROFILE', JSON.stringify(newProfile));
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setTempProfile({ ...profile });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem('USER_PROFILE', JSON.stringify(tempProfile));
      setProfile({ ...tempProfile });
      setIsEditing(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {
      Alert.alert("Error", "Failed to save profile.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempProfile({ ...profile });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const stats = [
    { label: 'Days Active', value: '124' },
    { label: 'Avg Hours', value: '8.5' },
    { label: 'On Time', value: '92%' },
  ];

  return (
    <View style={styles.container}>
      {/* Static Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.topActions}>
          {isEditing ? (
            <View style={styles.editActions}>
              <TouchableOpacity onPress={handleCancel} style={[styles.actionBtn, styles.cancelBtn]}>
                <XIcon size={18} color={Colors.error} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} style={[styles.actionBtn, styles.saveBtn]}>
                <CheckIcon size={18} color="#FFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={handleEdit} style={styles.actionBtn}>
              <EditIcon size={18} color={Colors.primary} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.avatarContainer}>
          <View style={styles.avatarBorder}>
            <View style={styles.avatar}>
              {profile.avatarUri ? (
                  <Image source={{ uri: isEditing ? (tempProfile.avatarUri || profile.avatarUri) : profile.avatarUri }} style={styles.avatarImg} />
              ) : (
                  <Text style={styles.avatarInitial}>{isEditing ? tempProfile.name[0] : profile.name[0]}</Text>
              )}
            </View>
          </View>
          <TouchableOpacity style={styles.cameraBtn} onPress={pickImage}>
            <CameraIcon size={16} color="#FFF" />
          </TouchableOpacity>
        </View>
        
        {isEditing ? (
          <View style={styles.editingHeader}>
            <TextInput
              style={[styles.name, styles.inputName]}
              value={tempProfile.name}
              onChangeText={(t) => setTempProfile(p => ({ ...p, name: t }))}
              placeholder="Full Name"
            />
            <TextInput
              style={[styles.role, styles.inputRole]}
              value={tempProfile.role}
              onChangeText={(t) => setTempProfile(p => ({ ...p, role: t }))}
              placeholder="Role"
            />
          </View>
        ) : (
          <View style={styles.textHeader}>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.role}>{profile.role}</Text>
          </View>
        )}
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Row */}
        {!isEditing && (
          <View style={styles.statsRow}>
            {stats.map((s, i) => (
              <View key={s.label} style={[styles.statItem, i < stats.length - 1 && styles.statBorder]}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Info List */}
        <View style={styles.infoList}>
          <Text style={styles.sectionTitle}>PERSONAL INFORMATION</Text>
          <View style={styles.infoCard}>
            <InfoRow icon={BriefcaseIcon} label="DEPARTMENT" value={isEditing ? tempProfile.dept : profile.dept} isEditing={isEditing} onChangeText={(t) => setTempProfile(p => ({ ...p, dept: t }))} />
            <InfoRow icon={CalendarIcon} label="JOINED DATE" value={isEditing ? tempProfile.joined : profile.joined} isEditing={isEditing} onChangeText={(t) => setTempProfile(p => ({ ...p, joined: t }))} />
            <InfoRow icon={MailIcon} label="EMAIL" value={isEditing ? tempProfile.email : profile.email} isEditing={isEditing} onChangeText={(t) => setTempProfile(p => ({ ...p, email: t }))} keyboardType="email-address" />
            <InfoRow icon={PhoneIcon} label="PHONE" value={isEditing ? tempProfile.phone : profile.phone} isEditing={isEditing} onChangeText={(t) => setTempProfile(p => ({ ...p, phone: t }))} keyboardType="phone-pad" />
            <InfoRow icon={MapPinIcon} label="LOCATION" value={isEditing ? tempProfile.location : profile.location} isEditing={isEditing} onChangeText={(t) => setTempProfile(p => ({ ...p, location: t }))} isLast />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function InfoRow({ icon: Icon, label, value, isEditing, onChangeText, keyboardType, isLast }: any) {
  return (
    <View style={[styles.infoRow, !isLast && styles.rowBorder]}>
      <View style={styles.iconBox}>
        <Icon size={18} color={Colors.primary} strokeWidth={2.2} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        {isEditing ? (
          <TextInput
            style={styles.infoValueInput}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
          />
        ) : (
          <Text style={styles.infoValue}>{value}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    alignItems: 'center',
    paddingBottom: 24,
    backgroundColor: Colors.background,
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F0',
  },
  topActions: {
    position: 'absolute',
    top: 55,
    right: 24,
    zIndex: 15,
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  saveBtn: {
    backgroundColor: Colors.primary,
  },
  cancelBtn: {
    borderWidth: 1,
    borderColor: Colors.error + '40',
  },
  avatarContainer: {
    position: 'relative',
    marginTop: 10,
    marginBottom: 16,
  },
  avatarBorder: {
    padding: 4,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
    fontSize: 40,
    fontFamily: 'PlusJakartaSans-ExtraBold',
    color: '#FFF',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: Colors.accent,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.background,
  },
  textHeader: {
      alignItems: 'center',
  },
  name: {
    fontSize: 22,
    fontFamily: 'PlusJakartaSans-ExtraBold',
    color: Colors.text,
  },
  role: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.muted,
    marginTop: 4,
  },
  editingHeader: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 40,
  },
  inputName: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
    textAlign: 'center',
    paddingBottom: 2,
    width: '100%',
    fontSize: 22,
    fontFamily: 'PlusJakartaSans-ExtraBold',
    color: Colors.text,
  },
  inputRole: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    textAlign: 'center',
    marginTop: 8,
    width: '100%',
    fontSize: 13,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.muted,
  },
  scrollContent: {
    paddingBottom: 120,
    paddingTop: 10,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    marginHorizontal: 24,
    borderRadius: 20,
    paddingVertical: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 10,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statBorder: {
    borderRightWidth: 1,
    borderRightColor: '#F2F2F0',
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-ExtraBold',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.muted,
    marginTop: 2,
  },
  infoList: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans-ExtraBold',
    color: Colors.muted,
    letterSpacing: 1,
    marginBottom: 12,
    paddingLeft: 4,
  },
  infoCard: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F0',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.muted,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.text,
  },
  infoValueInput: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.text,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary + '30',
    padding: 0,
  },
});
