import React from 'react'
import { View, Text } from 'react-native'
import TurboImage from 'react-native-turbo-image'
import { Play } from '@/components/icons'

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
}: MessageBubbleProps) {
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
          <View
            className={`rounded-3xl p-1.5 mb-1 ${
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
          </View>
        )}

        {audioDuration && (
          <View
            className={`rounded-3xl px-4 py-3 w-72 mb-1 ${
              isMe
                ? 'bg-neutral-900 rounded-tr-sm'
                : 'bg-neutral-100 rounded-tl-sm'
            }`}
          >
            <View className="flex-row items-center gap-3">
              <View
                className={`w-8 h-8 rounded-full items-center justify-center ${
                  isMe ? 'bg-white' : 'bg-neutral-900'
                }`}
              >
                <Play
                  size={14}
                  color={isMe ? '#171717' : '#FFFFFF'}
                  fill={isMe ? '#171717' : '#FFFFFF'}
                />
              </View>
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
                          ? 'bg-white'
                          : 'bg-neutral-600'
                        : i < 6
                          ? 'bg-neutral-900'
                          : 'bg-neutral-300'
                    }`}
                    style={{ height: h }}
                  />
                ))}
              </View>
              <Text
                className={`text-xs font-semibold ${
                  isMe ? 'text-neutral-200' : 'text-neutral-700'
                }`}
              >
                {audioDuration}
              </Text>
            </View>
            {time && (
              <Text className="text-[10px] text-neutral-400 text-right mt-1 font-medium">
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
