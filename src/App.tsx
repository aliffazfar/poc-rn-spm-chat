import '../global.css'
import React from 'react'
import { StatusBar } from 'react-native'
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { Navigation, appLightTheme, appDarkTheme } from '@/navigation'
import { queryClient, clientPersister } from '@/utils/queryClient'
import { useAppInit } from '@/hooks'

function AppContent() {
  const { isDark, navigationRef } = useAppInit()

  return (
    <>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <Navigation
        ref={navigationRef}
        theme={isDark ? appDarkTheme : appLightTheme}
      />
    </>
  )
}

export default function App() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister: clientPersister }}
      >
        <AppContent />
      </PersistQueryClientProvider>
    </SafeAreaProvider>
  )
}
