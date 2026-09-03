import React, { useEffect, useRef, useState } from 'react'
import {
  Modal,
  View,
  Text,
  Pressable,
  PanResponder,
  Dimensions,
  StyleSheet,
} from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

export interface ActionSheetProps {
  visible: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  subtitle?: string
  className?: string
  contentClassName?: string
}

export function ActionSheet({
  visible,
  onClose,
  children,
  title,
  subtitle,
  className,
  contentClassName,
}: ActionSheetProps) {
  const insets = useSafeAreaInsets()
  const bottomPadding = Math.max(insets.bottom, 16)

  const [modalVisible, setModalVisible] = useState(visible)
  const translateY = useSharedValue(SCREEN_HEIGHT)
  const isClosing = useSharedValue(false)

  const dismiss = () => {
    if (isClosing.value) return
    isClosing.value = true
    translateY.value = withTiming(SCREEN_HEIGHT, { duration: 200 }, () => {
      runOnJS(setModalVisible)(false)
      runOnJS(onClose)()
      isClosing.value = false
    })
  }

  useEffect(() => {
    if (visible) {
      isClosing.value = false
      setModalVisible(true)
      translateY.value = SCREEN_HEIGHT
      translateY.value = withSpring(0, {
        damping: 24,
        stiffness: 220,
        mass: 0.8,
      })
    } else if (modalVisible) {
      dismiss()
    }
  }, [visible])

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gesture) => gesture.dy > 5,
      onPanResponderMove: (_, gesture) => {
        if (isClosing.value) return
        if (gesture.dy > 0) {
          translateY.value = gesture.dy
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (isClosing.value) return
        if (gesture.dy > 90 || gesture.vy > 0.6) {
          dismiss()
        } else {
          translateY.value = withSpring(0, {
            damping: 24,
            stiffness: 220,
            mass: 0.8,
          })
        }
      },
    }),
  ).current

  const sheetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: Math.max(0, translateY.value) }],
  }))

  const backdropAnimatedStyle = useAnimatedStyle(() => {
    const opacity = Math.max(0, 1 - translateY.value / (SCREEN_HEIGHT * 0.6))
    return {
      opacity: opacity * 0.5,
    }
  })

  if (!modalVisible) return null

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="none"
      onRequestClose={dismiss}
      statusBarTranslucent
    >
      <View style={styles.container}>
        {/* Animated Dim Backdrop */}
        <Animated.View style={[styles.backdrop, backdropAnimatedStyle]}>
          <Pressable style={styles.flex} onPress={dismiss} />
        </Animated.View>

        {/* Bottom Sheet Card */}
        <View style={styles.bottomWrapper} pointerEvents="box-none">
          <Animated.View
            style={[sheetAnimatedStyle, { paddingBottom: bottomPadding }]}
            className={`bg-white dark:bg-[#1E1E1E] rounded-t-3xl pt-3 border-t border-neutral-100 dark:border-neutral-800 shadow-2xl max-h-[88%] ${
              className ?? ''
            }`}
          >
            {/* Grabber Area with Drag Gesture & generous touch hitSlop */}
            <View
              {...panResponder.panHandlers}
              hitSlop={{ top: 12, bottom: 12, left: 30, right: 30 }}
              className="w-full pt-1 pb-2 items-center"
            >
              <View className="w-10 h-1 bg-neutral-300 dark:bg-neutral-700 rounded-full mb-2.5" />
              {title && (
                <Text className="text-xl font-bold text-neutral-900 dark:text-white text-center px-6">
                  {title}
                </Text>
              )}
              {subtitle && (
                <Text className="text-sm text-neutral-400 dark:text-neutral-500 mt-1 text-center px-6">
                  {subtitle}
                </Text>
              )}
            </View>

            {/* Content Area */}
            <View className={contentClassName ?? 'px-6 mt-1'}>{children}</View>
          </Animated.View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#000000',
  },
  flex: {
    flex: 1,
  },
})
