import React from 'react'
import { View, Text, Pressable } from 'react-native'
import TurboImage from 'react-native-turbo-image'
import { Play } from '@/components/icons'
import { useAppTheme } from '@/hooks/useAppTheme'

export interface MessageBubbleProps {
  id?: string | number
  text?: string
  imageUrl?: string
  blurhash?: string
  audioDuration?: string
  quotedText?: string
  time?: string
  isMe?: boolean
  isSystem?: boolean
  onPressImage?: () => void
  onPressAudio?: () => void
}

export function MessageBubble({
  text,
  imageUrl,
  blurhash,
  audioDuration,
  quotedText,
  time,
  isMe = false,
  isSystem = false,
  onPressImage,
  onPressAudio,
}: MessageBubbleProps) {
  const { isDark } = useAppTheme()
  const playColor = isMe === isDark ? '#FFFFFF' : '#171717'

  if (isSystem) {
    return (
      <View className="items-center my-3 px-6">
        <View className="bg-neutral-200/70 dark:bg-neutral-800/80 px-3 py-1 rounded-xl">
          <Text className="text-[11px] text-neutral-600 dark:text-neutral-400 font-medium text-center">
            {text}
          </Text>
        </View>
      </View>
    )
  }

  return (
    <View
      className={`flex-row ${isMe ? 'justify-end' : 'justify-start'} mb-2.5`}
    >
      <View className={`max-w-[82%] ${isMe ? 'items-end' : 'items-start'}`}>
        {quotedText && (
          <View className="border border-neutral-300 dark:border-neutral-700 rounded-2xl px-3 py-1.5 mb-1 bg-white dark:bg-[#282828]">
            <Text
              className="text-xs text-neutral-500 dark:text-neutral-400"
              numberOfLines={2}
            >
              {quotedText}
            </Text>
          </View>
        )}

        {imageUrl && (
          <Pressable
            onPress={onPressImage}
            disabled={!onPressImage}
            className={`rounded-3xl p-1.5 mb-1 active:opacity-90 ${
              isMe
                ? 'bg-neutral-900 dark:bg-white rounded-tr-sm'
                : 'bg-neutral-100 dark:bg-[#282828] rounded-tl-sm'
            }`}
          >
            <TurboImage
              source={{ uri: imageUrl }}
              placeholder={blurhash ? { blurhash } : undefined}
              style={{
                width: 240,
                height: 160,
                borderRadius: 16,
                backgroundColor: isMe ? '#262626' : '#E5E5E5',
              }}
              resize={600}
              resizeMode="cover"
              fadeDuration={blurhash ? 250 : 0}
            />
            {time && !text && (
              <Text className="text-[10px] text-neutral-400 text-right px-2 py-1 font-medium">
                {time}
              </Text>
            )}
          </Pressable>
        )}

        {audioDuration && (
          <View
            className={`rounded-3xl px-4 py-3 w-72 mb-1 ${
              isMe
                ? 'bg-neutral-900 dark:bg-white rounded-tr-sm'
                : 'bg-neutral-100 dark:bg-[#282828] rounded-tl-sm'
            }`}
          >
            <View className="flex-row items-center gap-3">
              <Pressable
                onPress={onPressAudio}
                disabled={!onPressAudio}
                className={`w-8 h-8 rounded-full items-center justify-center active:opacity-75 ${
                  isMe
                    ? 'bg-white dark:bg-neutral-900'
                    : 'bg-neutral-900 dark:bg-white'
                }`}
              >
                <Play size={14} color={playColor} fill={playColor} />
              </Pressable>
              <View className="flex-1 flex-row items-center gap-0.5 h-6">
                {[
                  6, 12, 18, 10, 22, 14, 8, 16, 20, 10, 14, 8, 18, 12, 6, 10,
                  14, 8,
                ].map((h, i) => (
                  <View
                    key={i}
                    className={`w-1 rounded-full ${
                      isMe
                        ? i < 6
                          ? 'bg-white dark:bg-neutral-900'
                          : 'bg-neutral-600 dark:bg-neutral-300'
                        : i < 6
                          ? 'bg-neutral-900 dark:bg-white'
                          : 'bg-neutral-300 dark:bg-neutral-600'
                    }`}
                    style={{ height: h }}
                  />
                ))}
              </View>
              <Text
                className={`text-xs font-semibold ${
                  isMe
                    ? 'text-neutral-200 dark:text-neutral-700'
                    : 'text-neutral-700 dark:text-neutral-300'
                }`}
              >
                {audioDuration}
              </Text>
            </View>
            {time && (
              <Text className="text-[10px] text-neutral-400 dark:text-neutral-500 text-right mt-1 font-medium">
                {time}
              </Text>
            )}
          </View>
        )}

        {text && (
          <View
            className={`rounded-3xl px-4 py-3 ${
              isMe
                ? 'bg-neutral-900 dark:bg-white rounded-tr-sm'
                : 'bg-neutral-100 dark:bg-[#282828] rounded-tl-sm'
            }`}
          >
            <Text
              className={`text-base leading-snug ${
                isMe
                  ? 'text-white dark:text-neutral-900'
                  : 'text-neutral-900 dark:text-white'
              }`}
            >
              {text}
            </Text>
            {time && (
              <Text
                className={`text-[10px] text-right mt-1 font-medium ${
                  isMe
                    ? 'text-neutral-400 dark:text-neutral-500'
                    : 'text-neutral-400 dark:text-neutral-400'
                }`}
              >
                {time}
              </Text>
            )}
          </View>
        )}
      </View>
    </View>
  )
}
