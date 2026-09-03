import React from 'react'
import { Text, View } from 'react-native'
import { APP_NAME, ENVIRONMENT } from '@env'

export function Header() {
  return (
    <View className="gap-2">
      <View className="flex-row items-center justify-between">
        <Text className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
          {APP_NAME}
        </Text>
        <View className="bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-full">
          <Text className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            {ENVIRONMENT}
          </Text>
        </View>
      </View>
      <Text className="text-sm text-neutral-500 dark:text-neutral-400">
        React Native 0.87 · SwiftPM · Uniwind Tailwind v4 · Reanimated 4
      </Text>
    </View>
  )
}
