import { Colors } from '@/constants/theme';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Calendar, Home, Settings, User } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  const focusedOptions = descriptors[state.routes[state.index].key].options as any;
  if (focusedOptions.tabBarStyle?.display === 'none') {
    return null;
  }

  return (
    <View style={[styles.outerContainer, { paddingBottom: Math.max(10, insets.bottom) }]}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const options = descriptors[route.key].options as any;
          if (options.href === null) return null;

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
    animatedValue.value = withTiming(isFocused ? 1 : 0, {
      duration: 250,
      easing: Easing.bezier(0.34, 1.56, 0.64, 1),
    });
  }, [isFocused]);

  const containerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: isFocused ? Colors.accent : 'transparent',
      paddingHorizontal: interpolate(animatedValue.value, [0, 1], [8, 18]),
    };
  });

  const labelStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(animatedValue.value, [0.5, 1], [0, 1]),
      width: interpolate(animatedValue.value, [0, 1], [0, 50]),
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
      style={{ flex: isFocused ? 2 : 1 }}
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
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: Colors.background,
    zIndex: 1000,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    borderRadius: 50,
    padding: 6,
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 40,
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
