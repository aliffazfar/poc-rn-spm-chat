import React from 'react'
import { View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Screen, AnimatedButton, EnvCard, Header } from '@/components'
import { getAppConfig } from '@/utils/config'

export function HomeScreen() {
  const navigation = useNavigation()
  const configItems = getAppConfig()

  return (
    <Screen
      edges={['top', 'bottom']}
      padded
      className="bg-neutral-50 dark:bg-neutral-950 justify-between py-4"
    >
      <Header />
      <EnvCard items={configItems} />
      <View className="gap-3">
        <AnimatedButton
          label="Open Native Form Sheet ↓"
          onPress={() => navigation.navigate('Profile')}
          subtitle="presentation: 'formSheet' · fitToContents"
        />
        <AnimatedButton
          label="Open Details Screen →"
          onPress={() => navigation.navigate('Details')}
          subtitle="React Navigation 7 · Native Stack"
        />
      </View>
    </Screen>
  )
}
