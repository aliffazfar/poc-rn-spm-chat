import React from 'react'
import { Text } from 'react-native'
import { Screen } from '@/components'

export function StatusScreen() {
  return (
    <Screen
      edges={['top', 'bottom']}
      padded
      className="justify-center items-center"
    >
      <Text className="text-2xl font-bold text-neutral-900 dark:text-white">
        Status
      </Text>
      <Text className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
        Updates & Stories
      </Text>
    </Screen>
  )
}
