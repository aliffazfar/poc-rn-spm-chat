import React from 'react'
import { Pressable, Text, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'

interface AnimatedButtonProps {
  label: string
  onPress: () => void
  subtitle?: string
}

export function AnimatedButton({
  label,
  onPress,
  subtitle,
}: AnimatedButtonProps) {
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const handlePressIn = () => {
    scale.value = withSpring(0.95)
  }

  const handlePressOut = () => {
    scale.value = withSpring(1)
    onPress()
  }

  return (
    <View className="gap-3">
      <Animated.View style={animatedStyle}>
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          className="bg-indigo-600 active:bg-indigo-700 py-4 rounded-xl items-center justify-center shadow-md shadow-indigo-500/20"
        >
          <Text className="text-base font-semibold text-white">{label}</Text>
        </Pressable>
      </Animated.View>
      {subtitle && (
        <Text className="text-xs text-center text-neutral-400">{subtitle}</Text>
      )}
    </View>
  )
}
