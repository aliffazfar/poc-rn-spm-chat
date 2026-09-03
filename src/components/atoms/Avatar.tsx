import React, { useEffect, useState } from 'react'
import { View, Text, ViewStyle, StyleProp } from 'react-native'
import TurboImage from 'react-native-turbo-image'
import { useAppTheme } from '@/hooks/useAppTheme'
import { Skeleton } from './Skeleton'

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

const SIZE_MAP: Record<AvatarSize, number> = {
  sm: 36,
  md: 48,
  lg: 56,
  xl: 80,
}

export interface AvatarProps {
  uri?: string
  name?: string
  size?: AvatarSize | number
  isOnline?: boolean
  className?: string
  style?: StyleProp<ViewStyle>
  blurhash?: string
}

export function Avatar({
  uri,
  name,
  size = 'md',
  isOnline,
  className = '',
  style,
  blurhash,
}: AvatarProps) {
  const { colors } = useAppTheme()
  const [isLoading, setIsLoading] = useState(Boolean(uri))
  const dimension = typeof size === 'number' ? size : SIZE_MAP[size]
  const radius = dimension / 2

  useEffect(() => {
    setIsLoading(Boolean(uri))
  }, [uri])

  const initials = name
    ? name
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : ''

  return (
    <View
      style={[{ width: dimension, height: dimension }, style]}
      className={`relative ${className}`}
    >
      {uri ? (
        <TurboImage
          source={{ uri }}
          placeholder={blurhash ? { blurhash } : undefined}
          style={{
            width: dimension,
            height: dimension,
            borderRadius: radius,
            backgroundColor: colors.surfaceVariant,
          }}
          resize={dimension * 2}
          resizeMode="cover"
          rounded
          fadeDuration={blurhash ? 250 : 0}
          onStart={() => setIsLoading(true)}
          onSuccess={() => setIsLoading(false)}
          onFailure={() => setIsLoading(false)}
        />
      ) : (
        <View
          style={{
            width: dimension,
            height: dimension,
            borderRadius: radius,
          }}
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

      {uri && isLoading && !blurhash ? (
        <Skeleton
          className="absolute"
          style={{
            width: dimension,
            height: dimension,
            borderRadius: radius,
            backgroundColor: colors.surfaceVariant,
          }}
        />
      ) : null}

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
  )
}
