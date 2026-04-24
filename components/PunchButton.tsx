import { Colors } from '@/constants/theme';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { User } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { Circle, Svg } from 'react-native-svg';

const { width } = Dimensions.get('window');
const BUTTON_SIZE = 160;
const RADIUS = (BUTTON_SIZE / 2) - 6;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface PunchButtonProps {
  status: 'idle' | 'in' | 'break' | 'out';
  onPress: () => void;
  onHoldComplete: () => void;
}

export function PunchButton({ status, onPress, onHoldComplete }: PunchButtonProps) {
  const progress = useSharedValue(0);
  const ripple = useSharedValue(0);
  const scale = useSharedValue(1);
  const holdFinished = useSharedValue(0); // 0: false, 1: true
  const [holdActive, setHoldActive] = useState(false);
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    // Ripples only in 'in' state to keep other states "calm"
    if (status === 'in') {
      ripple.value = 0;
      ripple.value = withRepeat(
        withTiming(1, { duration: 2000 }),
        -1,
        false
      );
    } else {
      ripple.value = 0;
    }
  }, [status]);

  const punchConfig = {
    idle: { label: 'Punch In', color: Colors.primary, sub: 'Tap to start' },
    in: { label: 'Start Break', color: Colors.accent, sub: 'Hold 5s to punch out' },
    break: { label: 'Stop Break', color: '#E07070', sub: 'Tap to resume work' },
    out: { label: 'Done', color: Colors.muted, sub: 'Punched out' },
  };

  const pc = punchConfig[status];

  const rippleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      ripple.value,
      [0, 0.7, 1],
      [0.6, 0.3, 0],
      Extrapolate.CLAMP
    );
    const s = interpolate(
      ripple.value,
      [0, 1],
      [1, 1.6],
      Extrapolate.CLAMP
    );
    return {
      transform: [{ scale: s }],
      opacity: opacity,
      borderColor: pc.color,
    };
  });

  const animatedProps = useAnimatedProps(() => {
    // Sync shared value to JS state for the timer text
    runOnJS(setDisplayProgress)(progress.value);
    return {
      strokeDashoffset: CIRCUMFERENCE * (1 - progress.value),
    };
  });

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (status === 'out' || status === 'break') return; // Disable hold during break
    holdFinished.value = 0;
    
    scale.value = withSpring(0.9, { damping: 12, stiffness: 200 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (status === 'in') {
      setHoldActive(true);
      progress.value = withTiming(1, { duration: 5000 }, (finished) => {
        if (finished) {
          runOnJS(Haptics.notificationAsync)(Haptics.NotificationFeedbackType.Success);
          runOnJS(onHoldComplete)();
          runOnJS(setHoldActive)(false);
          holdFinished.value = 1;
          progress.value = 0;
        }
      });
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    if (holdActive) {
      cancelAnimation(progress);
      progress.value = withTiming(0, { duration: 300 });
      setHoldActive(false);
    }
  };

  const handlePress = () => {
    if (holdFinished.value === 1) {
        holdFinished.value = 0;
        return;
    }
    if (status !== 'out') {
        onPress();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subText}>{pc.sub}</Text>
      
      <View style={styles.buttonWrapper}>
        {/* Ripples */}
        {status === 'in' && (
          <>
            <Animated.View style={[styles.ripple, rippleStyle]} />
          </>
        )}

        {/* Progress Ring */}
        <Svg width={BUTTON_SIZE + 20} height={BUTTON_SIZE + 20} style={styles.svg}>
          <Circle
            cx={(BUTTON_SIZE + 20) / 2}
            cy={(BUTTON_SIZE + 20) / 2}
            r={RADIUS}
            fill="none"
            stroke="#E8E5E0"
            strokeWidth="4"
          />
          <AnimatedCircle
            cx={(BUTTON_SIZE + 20) / 2}
            cy={(BUTTON_SIZE + 20) / 2}
            r={RADIUS}
            fill="none"
            stroke={Colors.error}
            strokeWidth="4"
            strokeDasharray={CIRCUMFERENCE}
            animatedProps={animatedProps}
            strokeLinecap="round"
            transform={`rotate(-90 ${(BUTTON_SIZE + 20) / 2} ${(BUTTON_SIZE + 20) / 2})`}
          />
        </Svg>

        {/* Main Button */}
        <Pressable
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={status === 'out'}
        >
          <Animated.View style={[styles.button, buttonAnimatedStyle]}>
            <LinearGradient
              colors={['#ffffff', '#dddbd6']}
              style={styles.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <LinearGradient
                colors={['#ebebea', '#fafaf8']}
                style={styles.innerGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <LinearGradient
                  colors={['#f8f7f3', '#e8e6e1']}
                  style={styles.centerCircle}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  {!holdActive ? (
                      <>
                        <User size={26} color={pc.color} fill={pc.color} />
                        <Text style={[styles.buttonLabel, { color: pc.color }]}>{pc.label.toUpperCase()}</Text>
                      </>
                  ) : (
                      <View style={styles.timerContent}>
                          <Text style={styles.timerValue}>
                            {Math.ceil((1 - displayProgress) * 5)}
                          </Text>
                          <Text style={styles.timerSec}>SEC</Text>
                      </View>
                  )}
                </LinearGradient>
              </LinearGradient>
            </LinearGradient>
          </Animated.View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  subText: {
    fontSize: 11,
    color: Colors.muted,
    fontFamily: 'PlusJakartaSans-Medium',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  buttonWrapper: {
    width: BUTTON_SIZE + 80,
    height: BUTTON_SIZE + 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ripple: {
    position: 'absolute',
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    borderWidth: 2,
  },
  svg: {
    position: 'absolute',
    zIndex: 3,
    pointerEvents: 'none',
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerGradient: {
    width: BUTTON_SIZE * 0.825,
    height: BUTTON_SIZE * 0.825,
    borderRadius: (BUTTON_SIZE * 0.825) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  centerCircle: {
    width: BUTTON_SIZE * 0.625,
    height: BUTTON_SIZE * 0.625,
    borderRadius: (BUTTON_SIZE * 0.625) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  buttonLabel: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans-ExtraBold',
    letterSpacing: 0.6,
  },
  timerContent: {
      alignItems: 'center',
      justifyContent: 'center',
  },
  timerValue: {
    fontSize: 32,
    fontFamily: 'PlusJakartaSans-ExtraBold',
    color: Colors.error,
    lineHeight: 34,
  },
  timerSec: {
      fontSize: 10,
      fontFamily: 'PlusJakartaSans-Bold',
      color: Colors.error,
      letterSpacing: 1,
      marginTop: -2,
  }
});
