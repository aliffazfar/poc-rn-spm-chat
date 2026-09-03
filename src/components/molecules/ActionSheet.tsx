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
} from 'react-native-reanimated'
import { scheduleOnRN } from 'react-native-worklets'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Toaster } from './Toaster'

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
      scheduleOnRN(setModalVisible, false)
      scheduleOnRN(onClose)
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
            className={`bg-white dark:bg-[#1E1E1E] rounded-t-[32px] pt-3 border-t border-neutral-200/60 dark:border-neutral-800 shadow-2xl max-h-[90%] ${
              className ?? ''
            }`}
          >
            {/* Grabber Area with Drag Gesture & generous touch hitSlop */}
            <View
              {...panResponder.panHandlers}
              hitSlop={{ top: 12, bottom: 12, left: 30, right: 30 }}
              className="w-full pt-0.5 pb-2.5 items-center"
            >
              <View className="w-9 h-1.5 bg-neutral-300 dark:bg-neutral-700 rounded-full mb-3" />
              {title && (
                <Text className="text-lg font-bold text-neutral-900 dark:text-white text-center px-8 tracking-tight">
                  {title}
                </Text>
              )}
              {subtitle && (
                <Text className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5 text-center px-8 leading-4">
                  {subtitle}
                </Text>
              )}
            </View>

            {/* Content Area */}
            <View className={contentClassName ?? 'px-5 mt-1'}>{children}</View>
          </Animated.View>
        </View>

        {/* Toaster inside Modal Window: Guaranteed in front of backdrop & sheet */}
        <Toaster />
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
