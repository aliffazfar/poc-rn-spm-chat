import React from 'react'
import { Pressable, Text, View } from 'react-native'
import {
  Phone,
  PhoneIncoming,
  PhoneMissed,
  PhoneOutgoing,
  Video,
} from '@/components/icons'
import { useAppTheme } from '@/hooks'
import { Avatar } from '../atoms/Avatar'

export type CallDirection = 'incoming' | 'outgoing' | 'missed'
export type CallMode = 'audio' | 'video'

export interface CallLogRowProps {
  avatar?: string
  name: string
  direction: CallDirection
  mode: CallMode
  time: string
  duration?: string
  onPress?: () => void
  onCallPress?: () => void
}

function DirectionIcon({
  direction,
  color,
}: {
  direction: CallDirection
  color: string
}) {
  if (direction === 'missed') {
    return <PhoneMissed size={17} color={color} strokeWidth={1.9} />
  }

  if (direction === 'incoming') {
    return <PhoneIncoming size={17} color={color} strokeWidth={1.9} />
  }

  return <PhoneOutgoing size={17} color={color} strokeWidth={1.9} />
}

export function getCallDirectionLabel(direction: CallDirection) {
  if (direction === 'missed') return 'Missed call'
  return direction === 'incoming' ? 'Incoming' : 'Outgoing'
}

export function CallLogRow({
  avatar,
  name,
  direction,
  mode,
  time,
  duration,
  onPress,
  onCallPress,
}: CallLogRowProps) {
  const { colors } = useAppTheme()
  const isMissed = direction === 'missed'
  const directionColor = isMissed ? colors.danger : colors.accent
  const CallActionIcon = mode === 'video' ? Video : Phone

  return (
    <Pressable
      className="flex-row items-center px-5 py-3 active:bg-neutral-50 dark:active:bg-neutral-800/50"
      onPress={onPress}
    >
      <Avatar uri={avatar} name={name} size={52} />
      <View className="ml-3.5 flex-1 min-w-0">
        <Text
          className="text-base font-bold text-neutral-900 dark:text-white"
          numberOfLines={1}
        >
          {name}
        </Text>
        <View className="flex-row items-center mt-1">
          <DirectionIcon direction={direction} color={directionColor} />
          <Text
            className="ml-1.5 text-sm font-medium"
            style={{ color: directionColor }}
            numberOfLines={1}
          >
            {getCallDirectionLabel(direction)}
            {duration ? ` · ${duration}` : ''}
          </Text>
        </View>
      </View>
      <View className="items-end ml-3">
        <Text
          className="text-xs font-medium text-neutral-400 dark:text-neutral-500"
          numberOfLines={1}
        >
          {time}
        </Text>
        <Pressable
          hitSlop={8}
          className="mt-2 active:opacity-60"
          onPress={onCallPress}
        >
          <CallActionIcon size={20} color={colors.text} strokeWidth={1.8} />
        </Pressable>
      </View>
    </Pressable>
  )
}
