import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  Image,
  Pressable,
  PanResponder,
  Dimensions,
  StyleSheet,
  StatusBar,
  BackHandler,
} from 'react-native'
import TurboImage from 'react-native-turbo-image'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated'
import { scheduleOnRN } from 'react-native-worklets'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { create } from 'zustand'
import { ChevronLeft, Close, ChevronRight } from '@/components/icons'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('screen')
const imageDimensionsCache = new Map<string, number>()

export interface PreviewMedia {
  uri: string
  blurhash?: string
  aspectRatio?: number
}

export interface ImagePreviewProps {
  visible?: boolean
  onClose?: () => void
  imageUrl?: string
  blurhash?: string
  aspectRatio?: number
  images?: PreviewMedia[]
  initialIndex?: number
  title?: string
}

interface ImagePreviewStore {
  isOpen: boolean
  images: PreviewMedia[]
  initialIndex: number
  title?: string
  open: (options: {
    uri?: string
    imageUrl?: string
    blurhash?: string
    aspectRatio?: number
    images?: PreviewMedia[]
    initialIndex?: number
    title?: string
  }) => void
  close: () => void
}

export const useImagePreviewStore = create<ImagePreviewStore>((set) => ({
  isOpen: false,
  images: [],
  initialIndex: 0,
  title: undefined,
  open: ({
    uri,
    imageUrl,
    blurhash,
    aspectRatio,
    images,
    initialIndex = 0,
    title,
  }) => {
    const list: PreviewMedia[] = images?.length
      ? images
      : uri || imageUrl
        ? [{ uri: (uri || imageUrl)!, blurhash, aspectRatio }]
        : []
    set({
      isOpen: true,
      images: list,
      initialIndex,
      title,
    })
  },
  close: () => set({ isOpen: false }),
}))

export const imagePreview = {
  open: (options: Parameters<ImagePreviewStore['open']>[0]) =>
    useImagePreviewStore.getState().open(options),
  close: () => useImagePreviewStore.getState().close(),
}

export function ImagePreview(props?: Partial<ImagePreviewProps>) {
  const store = useImagePreviewStore()
  const insets = useSafeAreaInsets()

  const isControlled = props?.visible !== undefined
  const visible = isControlled ? Boolean(props?.visible) : store.isOpen
  const onClose = isControlled ? (props?.onClose ?? (() => {})) : store.close
  const images = isControlled ? props?.images : store.images
  const imageUrl = isControlled ? props?.imageUrl : undefined
  const blurhash = isControlled ? props?.blurhash : undefined
  const propAspectRatio = isControlled ? props?.aspectRatio : undefined
  const initialIndex = isControlled
    ? (props?.initialIndex ?? 0)
    : store.initialIndex
  const title = isControlled ? props?.title : store.title

  const [modalVisible, setModalVisible] = useState(visible)
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [cachedList, setCachedList] = useState<PreviewMedia[]>([])
  const [cachedMedia, setCachedMedia] = useState<PreviewMedia | null>(null)

  const initialRatio =
    cachedMedia?.aspectRatio ??
    (cachedMedia?.uri
      ? imageDimensionsCache.get(cachedMedia.uri)
      : undefined) ??
    1.4
  const [aspectRatio, setAspectRatio] = useState<number>(initialRatio)

  // Target frame bounds
  const maxImageHeight = SCREEN_HEIGHT * 0.72
  const computedHeight = Math.min(SCREEN_WIDTH / aspectRatio, maxImageHeight)
  const computedWidth = Math.min(computedHeight * aspectRatio, SCREEN_WIDTH)

  // GPU-only UI thread values
  const translateY = useSharedValue(0)
  const translateX = useSharedValue(0)
  const opacity = useSharedValue(0)
  const scale = useSharedValue(0.9)
  const isClosing = useSharedValue(false)

  const finishClose = () => {
    setModalVisible(false)
    onClose()
    isClosing.value = false
  }

  // ponytail: Simple scale-down + drop dissolve creates the illusion of shrinking back into the card with zero coordinate overhead
  const dismiss = () => {
    if (isClosing.value) return
    isClosing.value = true

    opacity.value = withTiming(0, {
      duration: 240,
      easing: Easing.out(Easing.cubic),
    })
    scale.value = withTiming(0.72, {
      duration: 240,
      easing: Easing.out(Easing.cubic),
    })
    translateY.value = withTiming(
      28,
      { duration: 240, easing: Easing.out(Easing.cubic) },
      (finished) => {
        if (finished) {
          scheduleOnRN(finishClose)
        }
      },
    )
  }

  const dismissWithSwipe = (vy: number) => {
    if (isClosing.value) return
    isClosing.value = true

    const targetY = vy < 0 ? -SCREEN_HEIGHT * 0.65 : SCREEN_HEIGHT * 0.65
    opacity.value = withTiming(0, {
      duration: 220,
      easing: Easing.out(Easing.cubic),
    })
    scale.value = withTiming(0.68, {
      duration: 220,
      easing: Easing.out(Easing.cubic),
    })
    translateY.value = withTiming(
      targetY,
      { duration: 220, easing: Easing.out(Easing.cubic) },
      (finished) => {
        if (finished) {
          scheduleOnRN(finishClose)
        }
      },
    )
  }

  useEffect(() => {
    if (visible) {
      const list: PreviewMedia[] = images?.length
        ? images
        : imageUrl
          ? [
              {
                uri: imageUrl,
                blurhash,
                aspectRatio: propAspectRatio,
              },
            ]
          : []
      setCachedList(list)
      setCurrentIndex(initialIndex)
      const current = list[initialIndex] ?? null
      setCachedMedia(current)
      setModalVisible(true)
      isClosing.value = false

      if (current) {
        const known =
          current.aspectRatio ?? imageDimensionsCache.get(current.uri) ?? 1.4
        setAspectRatio(known)
      }

      // Smooth zoom-in entrance
      translateY.value = 0
      translateX.value = 0
      scale.value = 0.88
      opacity.value = 0

      opacity.value = withTiming(1, {
        duration: 220,
        easing: Easing.out(Easing.cubic),
      })
      scale.value = withSpring(1, { damping: 24, stiffness: 240, mass: 0.8 })
    } else if (modalVisible && !isClosing.value) {
      dismiss()
    }
  }, [visible, imageUrl, blurhash, propAspectRatio, images, initialIndex])

  // Sync aspect ratio when media changes or loads
  useEffect(() => {
    if (cachedMedia?.uri) {
      const known =
        cachedMedia.aspectRatio ??
        imageDimensionsCache.get(cachedMedia.uri) ??
        1.4
      setAspectRatio(known)

      if (!imageDimensionsCache.has(cachedMedia.uri)) {
        Image.getSize(
          cachedMedia.uri,
          (w, h) => {
            if (w && h) {
              const r = w / h
              imageDimensionsCache.set(cachedMedia.uri, r)
              setAspectRatio(r)
            }
          },
          () => {},
        )
      }
    }
  }, [cachedMedia?.uri, cachedMedia?.aspectRatio])

  // Android hardware back button
  useEffect(() => {
    if (!modalVisible) return
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      dismiss()
      return true
    })
    return () => sub.remove()
  }, [modalVisible])

  // Pan responder for fluid drag gesture
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 4,
      onPanResponderMove: (_, g) => {
        translateY.value = g.dy
        translateX.value = g.dx * 0.25
        const pullDist = Math.abs(g.dy)
        const pullRatio = Math.min(pullDist / (SCREEN_HEIGHT * 0.4), 1)
        scale.value = 1 - pullRatio * 0.25
        opacity.value = 1 - pullRatio * 0.7
      },
      onPanResponderRelease: (_, g) => {
        if (Math.abs(g.dy) > 75 || Math.abs(g.vy) > 0.5) {
          dismissWithSwipe(g.vy)
        } else {
          translateY.value = withSpring(0, {
            damping: 25,
            stiffness: 260,
            mass: 0.7,
          })
          translateX.value = withSpring(0, {
            damping: 25,
            stiffness: 260,
            mass: 0.7,
          })
          scale.value = withSpring(1, {
            damping: 25,
            stiffness: 260,
            mass: 0.7,
          })
          opacity.value = withSpring(1, {
            damping: 25,
            stiffness: 260,
            mass: 0.7,
          })
        }
      },
    }),
  ).current

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  const imageStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }))

  const headerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  const handleIndexChange = (newIndex: number) => {
    setCurrentIndex(newIndex)
    const media = cachedList[newIndex]
    if (media) {
      setCachedMedia(media)
      const known =
        media.aspectRatio ?? imageDimensionsCache.get(media.uri) ?? 1.4
      setAspectRatio(known)
    }
  }

  if (!modalVisible || !cachedMedia) return null

  const hasMultiple = cachedList.length > 1
  const topSafePadding = (insets.top > 0 ? insets.top : 20) + 10

  return (
    <View
      style={[StyleSheet.absoluteFill, styles.rootOverlay]}
      pointerEvents="auto"
    >
      <StatusBar barStyle="light-content" animated />

      {/* Backdrop */}
      <Animated.View
        style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={dismiss} />
      </Animated.View>

      {/* Top Header Bar */}
      <Animated.View
        style={[
          { paddingTop: topSafePadding, paddingBottom: 12 },
          styles.headerBar,
          headerStyle,
        ]}
        pointerEvents="box-none"
      >
        {hasMultiple ? (
          <View className="bg-white/15 px-3.5 py-1.5 rounded-full backdrop-blur-md">
            <Text className="text-xs font-semibold text-white">
              {currentIndex + 1} / {cachedList.length}
            </Text>
          </View>
        ) : title ? (
          <Text
            className="text-base font-bold text-white/95 ml-1"
            numberOfLines={1}
          >
            {title}
          </Text>
        ) : (
          <View className="w-10" />
        )}

        <Pressable
          onPress={dismiss}
          hitSlop={12}
          className="w-10 h-10 rounded-full bg-white/15 active:bg-white/25 items-center justify-center backdrop-blur-md"
        >
          <Close size={18} color="#FFFFFF" strokeWidth={2.2} />
        </Pressable>
      </Animated.View>

      {/* Centered Interactive Image Container */}
      <View
        className="flex-1 items-center justify-center"
        pointerEvents="box-none"
      >
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            {
              width: computedWidth,
              height: computedHeight,
              borderRadius: 16,
              overflow: 'hidden',
            },
            imageStyle,
          ]}
        >
          <TurboImage
            source={{ uri: cachedMedia.uri }}
            placeholder={
              cachedMedia.blurhash
                ? { blurhash: cachedMedia.blurhash }
                : undefined
            }
            style={{
              width: computedWidth,
              height: computedHeight,
            }}
            resize={1200}
            resizeMode="cover"
            fadeDuration={250}
            onSuccess={(e) => {
              const { width, height } = e.nativeEvent
              if (width && height && cachedMedia?.uri) {
                const r = width / height
                imageDimensionsCache.set(cachedMedia.uri, r)
                if (Math.abs(r - aspectRatio) > 0.05) {
                  setAspectRatio(r)
                }
              }
            }}
          />
        </Animated.View>
      </View>

      {/* Navigation Arrows for Multi-image */}
      {hasMultiple && (
        <>
          {currentIndex > 0 && (
            <Pressable
              onPress={() => handleIndexChange(currentIndex - 1)}
              style={{ top: SCREEN_HEIGHT / 2 - 20 }}
              className="absolute left-4 z-50 w-10 h-10 rounded-full bg-white/15 active:bg-white/25 items-center justify-center backdrop-blur-md"
            >
              <ChevronLeft size={22} color="#FFFFFF" strokeWidth={2} />
            </Pressable>
          )}

          {currentIndex < cachedList.length - 1 && (
            <Pressable
              onPress={() => handleIndexChange(currentIndex + 1)}
              style={{ top: SCREEN_HEIGHT / 2 - 20 }}
              className="absolute right-4 z-50 w-10 h-10 rounded-full bg-white/15 active:bg-white/25 items-center justify-center backdrop-blur-md"
            >
              <ChevronRight size={22} color="#FFFFFF" strokeWidth={2} />
            </Pressable>
          )}
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  rootOverlay: {
    zIndex: 99999,
    elevation: 99999,
  },
  backdrop: {
    backgroundColor: '#000000',
  },
  headerBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
})
