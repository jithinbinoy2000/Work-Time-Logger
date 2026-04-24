import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Home, Calendar, User, Settings } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  useSharedValue, 
  interpolate,
  useDerivedValue,
  withTiming,
  Easing
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.outerContainer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TabItem
              key={route.key}
              isFocused={isFocused}
              onPress={onPress}
              route={route}
            />
          );
        })}
      </View>
    </View>
  );
}

function TabItem({ isFocused, onPress, route }: { isFocused: boolean, onPress: () => void, route: any }) {
  // Exact cubic-bezier(0.34, 1.56, 0.64, 1) equivalent spring
  const animatedValue = useSharedValue(isFocused ? 1 : 0);

  useEffect(() => {
    animatedValue.value = withSpring(isFocused ? 1 : 0, {
      damping: 14,
      stiffness: 120,
    });
  }, [isFocused]);

  const containerStyle = useAnimatedStyle(() => {
    return {
      flex: interpolate(animatedValue.value, [0, 1], [1, 2.2]),
      backgroundColor: isFocused ? Colors.accent : 'transparent',
    };
  });

  const labelStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(animatedValue.value, [0.5, 1], [0, 1]),
      width: interpolate(animatedValue.value, [0, 1], [0, 65]),
      transform: [{ scale: animatedValue.value }],
    };
  });

  const Icon = () => {
    const props = {
      size: 20,
      color: '#FFF',
      strokeWidth: 2.5,
    };
    switch (route.name) {
      case 'index': return <Home {...props} />;
      case 'attendance': return <Calendar {...props} />;
      case 'profile': return <User {...props} />;
      case 'settings': return <Settings {...props} />;
      default: return <Home {...props} />;
    }
  };

  const labelText = () => {
    switch (route.name) {
      case 'index': return 'Home';
      case 'attendance': return 'History';
      case 'profile': return 'Profile';
      case 'settings': return 'Settings';
      default: return route.name;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{ flex: isFocused ? 2.2 : 1 }}
    >
      <Animated.View style={[styles.tabItem, containerStyle]}>
        <Icon />
        {isFocused && (
          <Animated.View style={[styles.labelContainer, labelStyle]}>
            <Text numberOfLines={1} style={styles.tabLabel}>{labelText()}</Text>
          </Animated.View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    borderRadius: 50,
    padding: 6,
    alignItems: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 15,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 40,
    height: 48,
  },
  labelContainer: {
    marginLeft: 8,
    overflow: 'hidden',
  },
  tabLabel: {
    color: '#FFF',
    fontSize: 13,
    fontFamily: 'PlusJakartaSans-Bold',
    letterSpacing: 0.2,
  },
});
