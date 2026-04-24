import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path, Line } from 'react-native-svg';

export const CheckInIcon = ({ color }: { color: string }) => (
  <Svg width="38" height="38" viewBox="0 0 38 38" fill="none">
    <Circle cx="19" cy="21" r="12" stroke={color} strokeWidth="2.2"/>
    <Line x1="19" y1="21" x2="19" y2="15" stroke={color} strokeWidth="2.2" strokeLinecap="round"/>
    <Line x1="19" y1="21" x2="23" y2="24" stroke={color} strokeWidth="2.2" strokeLinecap="round"/>
    <Path d="M15 7 L19 3 L23 7" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <Path d="M15 10.5 L19 6.5 L23 10.5" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </Svg>
);

export const CheckOutIcon = ({ color }: { color: string }) => (
  <Svg width="38" height="38" viewBox="0 0 38 38" fill="none">
    <Circle cx="19" cy="21" r="12" stroke={color} strokeWidth="2.2"/>
    <Line x1="19" y1="21" x2="19" y2="15" stroke={color} strokeWidth="2.2" strokeLinecap="round"/>
    <Line x1="19" y1="21" x2="23" y2="24" stroke={color} strokeWidth="2.2" strokeLinecap="round"/>
    <Path d="M15 4 L19 8 L23 4" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <Path d="M15 7.5 L19 11.5 L23 7.5" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </Svg>
);

export const TotalHrsIcon = ({ color }: { color: string }) => (
  <Svg width="38" height="38" viewBox="0 0 38 38" fill="none">
    <Circle cx="19" cy="21" r="12" stroke={color} strokeWidth="2.2"/>
    <Line x1="19" y1="21" x2="19" y2="15" stroke={color} strokeWidth="2.2" strokeLinecap="round"/>
    <Line x1="19" y1="21" x2="23" y2="24" stroke={color} strokeWidth="2.2" strokeLinecap="round"/>
    <Path d="M15 7 L19 11 L23 7" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </Svg>
);
