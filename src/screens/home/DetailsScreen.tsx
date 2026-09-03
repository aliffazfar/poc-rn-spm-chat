import React from 'react'
import { Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Screen, AnimatedButton } from '@/components'

export function DetailsScreen() {
  const navigation = useNavigation()

  return (
    <Screen
      edges={['top', 'bottom']}
      padded
      className="bg-neutral-50 dark:bg-neutral-950 justify-between py-4"
    >
      <View className="gap-3">
        <Text className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
          Details Screen
        </Text>
        <Text className="text-sm text-neutral-500 dark:text-neutral-400">
          Native Stack transition powered by react-native-screens & React
          Navigation 7.
        </Text>
      </View>

      <AnimatedButton
        label="Go Back"
        onPress={() => navigation.goBack()}
        subtitle="Return to Home Screen"
      />
    </Screen>
  )
}
