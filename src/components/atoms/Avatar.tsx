import React from 'react';
import { View, Text, ViewStyle, StyleProp } from 'react-native';
import TurboImage from 'react-native-turbo-image';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

const SIZE_MAP: Record<AvatarSize, number> = {
  sm: 36,
  md: 48,
  lg: 56,
  xl: 80,
};

export interface AvatarProps {
  uri?: string;
  name?: string;
  size?: AvatarSize | number;
  isOnline?: boolean;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export function Avatar({
  uri,
  name,
  size = 'md',
  isOnline,
  className = '',
  style,
}: AvatarProps) {
  const dimension = typeof size === 'number' ? size : SIZE_MAP[size];
  const radius = dimension / 2;

  const initials = name
    ? name
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '';

  return (
    <View
      style={[{ width: dimension, height: dimension }, style]}
      className={`relative ${className}`}
    >
      {uri ? (
        <TurboImage
          source={{ uri }}
          style={{
            width: dimension,
            height: dimension,
            borderRadius: radius,
            backgroundColor: '#E5E5E5',
          }}
          resize={dimension * 2}
          resizeMode="cover"
          rounded
          fadeDuration={0}
        />
      ) : (
        <View
          style={{ width: dimension, height: dimension, borderRadius: radius }}
          className="bg-neutral-200 dark:bg-neutral-800 items-center justify-center"
        >
          <Text
            style={{ fontSize: dimension * 0.38 }}
            className="font-bold text-neutral-600 dark:text-neutral-300"
          >
            {initials || '?'}
          </Text>
        </View>
      )}

      {isOnline !== undefined && (
        <View
          style={{
            width: Math.max(10, dimension * 0.22),
            height: Math.max(10, dimension * 0.22),
            borderRadius: 999,
          }}
          className={`absolute bottom-0 right-0 border-2 border-white dark:border-[#1E1E1E] ${
            isOnline ? 'bg-emerald-500' : 'bg-neutral-400'
          }`}
        />
      )}
    </View>
  );
}
