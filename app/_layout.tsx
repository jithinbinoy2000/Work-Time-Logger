import { useEffect, useState } from 'react';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { 
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold 
} from '@expo-google-fonts/plus-jakarta-sans';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    'PlusJakartaSans-Regular': PlusJakartaSans_400Regular,
    'PlusJakartaSans-Medium': PlusJakartaSans_500Medium,
    'PlusJakartaSans-SemiBold': PlusJakartaSans_600SemiBold,
    'PlusJakartaSans-Bold': PlusJakartaSans_700Bold,
    'PlusJakartaSans-ExtraBold': PlusJakartaSans_800ExtraBold,
  });

  useEffect(() => {
    async function prepare() {
      try {
        const onboardingComplete = await AsyncStorage.getItem('ONBOARDING_COMPLETE');
        if (!onboardingComplete) {
          setShowOnboarding(true);
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
      }
    }
    prepare();
  }, []);

  useEffect(() => {
    if ((fontsLoaded || fontError) && isReady) {
      SplashScreen.hideAsync();
      if (showOnboarding) {
        router.replace('/onboarding');
      }
    }
  }, [fontsLoaded, fontError, isReady, showOnboarding]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
      <StatusBar style="dark" />
    </GestureHandlerRootView>
  );
}
