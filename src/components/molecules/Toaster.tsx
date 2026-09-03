import React, { useEffect, useRef } from 'react'
import {
  View,
  Text,
  Pressable,
  PanResponder,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { scheduleOnRN } from 'react-native-worklets'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { create } from 'zustand'
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
} from '@/components/icons'
import { useAppTheme } from '@/hooks'

export type ToastType =
  'normal' | 'action' | 'success' | 'info' | 'warning' | 'error' | 'loading'

export interface ToastAction {
  label: string
  onClick: () => void
}

export interface ToastData {
  id: string | number
  title: string | React.ReactNode
  description?: string | React.ReactNode
  type?: ToastType
  duration?: number
  action?: ToastAction
  cancel?: ToastAction
  onDismiss?: () => void
}

export interface ToastOptions extends Omit<Partial<ToastData>, 'id' | 'title'> {
  id?: string | number
}

interface ToastStore {
  toasts: ToastData[]
  addToast: (toast: ToastData) => string | number
  updateToast: (id: string | number, data: Partial<ToastData>) => void
  dismissToast: (id?: string | number) => void
}

let toastCounter = 0

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = toast.id ?? ++toastCounter
    set((state) => {
      const exists = state.toasts.some((t) => t.id === id)
      if (exists) {
        return {
          toasts: state.toasts.map((t) =>
            t.id === id ? { ...t, ...toast, id } : t,
          ),
        }
      }
      return { toasts: [{ ...toast, id }, ...state.toasts].slice(0, 3) }
    })
    return id
  },
  updateToast: (id, data) => {
    set((state) => ({
      toasts: state.toasts.map((t) => (t.id === id ? { ...t, ...data } : t)),
    }))
  },
  dismissToast: (id) => {
    set((state) => ({
      toasts: id ? state.toasts.filter((t) => t.id !== id) : [],
    }))
  },
}))

function createToast() {
  const fn = (message: string | React.ReactNode, options?: ToastOptions) =>
    useToastStore.getState().addToast({
      title: message,
      type: 'normal',
      ...options,
    } as ToastData)

  fn.success = (message: string | React.ReactNode, options?: ToastOptions) =>
    useToastStore.getState().addToast({
      title: message,
      type: 'success',
      ...options,
    } as ToastData)

  fn.error = (message: string | React.ReactNode, options?: ToastOptions) =>
    useToastStore.getState().addToast({
      title: message,
      type: 'error',
      ...options,
    } as ToastData)

  fn.info = (message: string | React.ReactNode, options?: ToastOptions) =>
    useToastStore.getState().addToast({
      title: message,
      type: 'info',
      ...options,
    } as ToastData)

  fn.warning = (message: string | React.ReactNode, options?: ToastOptions) =>
    useToastStore.getState().addToast({
      title: message,
      type: 'warning',
      ...options,
    } as ToastData)

  fn.loading = (message: string | React.ReactNode, options?: ToastOptions) =>
    useToastStore.getState().addToast({
      title: message,
      type: 'loading',
      duration: Infinity,
      ...options,
    } as ToastData)

  fn.promise = <T,>(
    promise: Promise<T>,
    data: {
      loading: string | React.ReactNode
      success:
        string | React.ReactNode | ((result: T) => string | React.ReactNode)
      error:
        string | React.ReactNode | ((error: any) => string | React.ReactNode)
    },
    options?: ToastOptions,
  ) => {
    const id = fn.loading(data.loading, options)
    promise
      .then((res) => {
        const title =
          typeof data.success === 'function' ? data.success(res) : data.success
        useToastStore.getState().updateToast(id, {
          title,
          type: 'success',
          duration: options?.duration ?? 3500,
        })
      })
      .catch((err) => {
        const title =
          typeof data.error === 'function' ? data.error(err) : data.error
        useToastStore.getState().updateToast(id, {
          title,
          type: 'error',
          duration: options?.duration ?? 3500,
        })
      })
    return id
  }

  fn.dismiss = (id?: string | number) => {
    useToastStore.getState().dismissToast(id)
  }

  return fn
}

export const toast = createToast()

export function useToaster() {
  const toasts = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismissToast)
  return { toasts, dismiss, toast }
}

function ToastItem({
  item,
  index,
  onDismiss,
}: {
  item: ToastData
  index: number
  onDismiss: () => void
}) {
  const { isDark } = useAppTheme()
  const translateY = useSharedValue(-60)
  const opacity = useSharedValue(0)
  const isClosing = useRef(false)

  const dismiss = () => {
    if (isClosing.current) return
    isClosing.current = true
    translateY.value = withTiming(-70, { duration: 180 }, () => {
      scheduleOnRN(onDismiss)
    })
    opacity.value = withTiming(0, { duration: 160 })
  }

  useEffect(() => {
    translateY.value = withSpring(0, {
      damping: 20,
      stiffness: 220,
      mass: 0.8,
    })
    opacity.value = withTiming(1, { duration: 200 })

    if (item.duration !== Infinity) {
      const timer = setTimeout(dismiss, item.duration ?? 3500)
      return () => clearTimeout(timer)
    }
  }, [item.id])

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => g.dy < -4,
      onPanResponderMove: (_, g) => {
        if (g.dy < 0) {
          translateY.value = g.dy
        }
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy < -30 || g.vy < -0.4) {
          dismiss()
        } else {
          translateY.value = withSpring(0, {
            damping: 20,
            stiffness: 220,
            mass: 0.8,
          })
        }
      },
    }),
  ).current

  const animatedStyle = useAnimatedStyle(() => {
    const scale = 1 - index * 0.05
    const stackY = index * -6
    return {
      transform: [{ translateY: translateY.value + stackY }, { scale }],
      opacity: opacity.value * (1 - index * 0.15),
      zIndex: 100 - index,
    }
  })

  const renderIcon = () => {
    switch (item.type) {
      case 'success':
        return <CheckCircle2 size={18} color="#10B981" />
      case 'error':
        return <AlertCircle size={18} color="#EF4444" />
      case 'warning':
        return <AlertTriangle size={18} color="#F59E0B" />
      case 'info':
        return <Info size={18} color="#3B82F6" />
      case 'loading':
        return (
          <ActivityIndicator
            size="small"
            color={isDark ? '#FFFFFF' : '#171717'}
          />
        )
      default:
        return null
    }
  }

  const icon = renderIcon()

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[styles.toastWrapper, animatedStyle]}
    >
      <Pressable
        onPress={dismiss}
        className="w-full flex-row items-center justify-between p-3.5 rounded-2xl bg-white/95 dark:bg-[#1E1E1E]/95 border border-neutral-200/90 dark:border-neutral-800 shadow-xl shadow-black/10 dark:shadow-black/60"
      >
        <View className="flex-row items-center flex-1 pr-2">
          {icon && <View className="mr-2.5">{icon}</View>}
          <View className="flex-1">
            {typeof item.title === 'string' ? (
              <Text className="text-[13.5px] font-semibold text-neutral-900 dark:text-white">
                {item.title}
              </Text>
            ) : (
              item.title
            )}
            {item.description &&
              (typeof item.description === 'string' ? (
                <Text className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-snug">
                  {item.description}
                </Text>
              ) : (
                item.description
              ))}
          </View>
        </View>

        {item.action && (
          <Pressable
            onPress={() => {
              item.action?.onClick()
              dismiss()
            }}
            className="bg-neutral-900 dark:bg-white px-3 py-1.5 rounded-xl ml-2 active:opacity-80"
          >
            <Text className="text-xs font-semibold text-white dark:text-neutral-900">
              {item.action.label}
            </Text>
          </Pressable>
        )}
      </Pressable>
    </Animated.View>
  )
}

export interface ToasterProps {
  offset?: number
}

export function Toaster({ offset = 8 }: ToasterProps) {
  const insets = useSafeAreaInsets()
  const { toasts, dismiss } = useToaster()

  if (toasts.length === 0) return null

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.container,
        {
          top: insets.top + offset,
        },
      ]}
    >
      {toasts.map((item, index) => (
        <ToastItem
          key={item.id}
          item={item}
          index={index}
          onDismiss={() => dismiss(item.id)}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 999999,
  },
  toastWrapper: {
    width: '92%',
    maxWidth: 400,
    marginBottom: 6,
  },
})
