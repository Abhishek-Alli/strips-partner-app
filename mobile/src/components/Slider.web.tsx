/**
 * Web-compatible Slider component
 * Uses HTML5 range input for web, should not be used on native
 */
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

interface SliderProps {
  style?: any;
  minimumValue: number;
  maximumValue: number;
  value: number;
  onValueChange: (value: number) => void;
  minimumTrackTintColor?: string;
  maximumTrackTintColor?: string;
}

export const Slider: React.FC<SliderProps> = ({
  style,
  minimumValue,
  maximumValue,
  value,
  onValueChange,
  minimumTrackTintColor = '#007AFF',
  maximumTrackTintColor = '#C7C7CC',
}) => {
  if (Platform.OS === 'web') {
    // Web implementation using HTML5 range input
    return (
      <View style={style}>
        <input
          type="range"
          min={minimumValue}
          max={maximumValue}
          value={value}
          onChange={(e) => onValueChange(parseFloat(e.target.value))}
          style={{
            width: '100%',
            height: '4px',
            appearance: 'none',
            background: `linear-gradient(to right, ${minimumTrackTintColor} 0%, ${minimumTrackTintColor} ${((value - minimumValue) / (maximumValue - minimumValue)) * 100}%, ${maximumTrackTintColor} ${((value - minimumValue) / (maximumValue - minimumValue)) * 100}%, ${maximumTrackTintColor} 100%)`,
            outline: 'none',
            borderRadius: '2px',
          }}
        />
        <style>{`
          input[type="range"]::-webkit-slider-thumb {
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: ${minimumTrackTintColor};
            cursor: pointer;
            border: 2px solid #fff;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
          input[type="range"]::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: ${minimumTrackTintColor};
            cursor: pointer;
            border: 2px solid #fff;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
        `}</style>
      </View>
    );
  }
  
  // For native platforms, this should not be used
  // Native should import from @react-native-community/slider
  return null;
};

export default Slider;

