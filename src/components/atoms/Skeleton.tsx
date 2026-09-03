import React, { useEffect } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated'

export interface SkeletonProps {
  className?: string
  style?: StyleProp<ViewStyle>
}

export function Skeleton({ className = '', style }: SkeletonProps) {
  const opacity = useSharedValue(0.35)

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.85, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    )
  }, [opacity])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  return (
    <Animated.View
      style={[animatedStyle, style]}
      className={`bg-neutral-200 dark:bg-neutral-800 ${className}`}
    />
  )
}
