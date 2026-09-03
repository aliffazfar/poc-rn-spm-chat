import React, { useEffect } from 'react'
import { View } from 'react-native'
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { scheduleOnRN } from 'react-native-worklets'

const DEFAULT_STATUS_DURATION = 5000

export interface StatusProgressBarProps {
  index: number
  activeIndex: number
  backgroundColor: string
  fillColor: string
  duration?: number
  onComplete: () => void
}

export function StatusProgressBar({
  index,
  activeIndex,
  backgroundColor,
  fillColor,
  duration = DEFAULT_STATUS_DURATION,
  onComplete,
}: StatusProgressBarProps) {
  const progress = useSharedValue(index < activeIndex ? 1 : 0)
  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }))

  useEffect(() => {
    cancelAnimation(progress)

    if (index < activeIndex) {
      progress.value = 1
      return
    }

    if (index > activeIndex) {
      progress.value = 0
      return
    }

    progress.value = 0
    progress.value = withTiming(1, { duration }, (finished) => {
      if (finished) {
        scheduleOnRN(onComplete)
      }
    })

    return () => cancelAnimation(progress)
  }, [activeIndex, duration, index, onComplete, progress])

  return (
    <View
      className="flex-1 h-1 overflow-hidden rounded-full"
      style={{ backgroundColor }}
    >
      <Animated.View
        className="h-full rounded-full"
        style={[{ backgroundColor: fillColor }, animatedStyle]}
      />
    </View>
  )
}
