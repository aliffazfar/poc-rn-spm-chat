import React from 'react'
import { Text, View } from 'react-native'
import { EnvItem } from '@/types'

interface EnvCardProps {
  items: EnvItem[]
}

export function EnvCard({ items }: EnvCardProps) {
  return (
    <View className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-sm gap-4">
      <Text className="text-xs font-bold uppercase tracking-wider text-neutral-400">
        Loaded Environment Config
      </Text>
      <View className="gap-3">
        {items.map((item) => (
          <View
            key={item.label}
            className="flex-row justify-between items-center py-1 border-b border-neutral-100 dark:border-neutral-800 last:border-b-0"
          >
            <Text className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
              {item.label}
            </Text>
            <Text className="text-xs font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 px-2 py-1 rounded-md">
              {item.value || 'undefined'}
            </Text>
          </View>
        ))}
      </View>
    </View>
  )
}
