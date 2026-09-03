import React, { type ComponentType } from 'react'
import { Pressable, Text, View } from 'react-native'
import {
  Camera,
  EllipsisVertical,
  Search,
  type IconProps,
} from '@/components/icons'
import { useAppTheme } from '@/hooks'

type TabHeaderIcon = 'camera' | 'more' | 'search'

export interface TabHeaderAction {
  icon: TabHeaderIcon
  onPress?: () => void
}

const ACTION_ICONS: Record<TabHeaderIcon, ComponentType<IconProps>> = {
  camera: Camera,
  more: EllipsisVertical,
  search: Search,
}

export function TabHeader({
  title,
  actions = [],
}: {
  title: string
  actions?: TabHeaderAction[]
}) {
  const { colors } = useAppTheme()

  return (
    <View className="flex-row items-center justify-between px-5 pt-3 pb-4 bg-white dark:bg-[#1E1E1E]">
      <Text className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
        {title}
      </Text>
      <View className="flex-row items-center gap-5">
        {actions.map((action) => {
          const Icon = ACTION_ICONS[action.icon]

          return (
            <Pressable
              key={action.icon}
              hitSlop={10}
              className="active:opacity-60"
              onPress={action.onPress}
            >
              <Icon size={24} color={colors.text} strokeWidth={1.75} />
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}
