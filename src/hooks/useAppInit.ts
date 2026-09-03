import { useEffect } from 'react'
import { AppState, type AppStateStatus, Platform } from 'react-native'
import { focusManager } from '@tanstack/react-query'
import { Uniwind } from 'uniwind'
import {
  useSafeAreaInsets,
  initialWindowMetrics,
} from 'react-native-safe-area-context'
import { useTanStackQueryDevTools } from '@rozenite/tanstack-query-plugin'
import {
  createMMKVStorageAdapter,
  useRozeniteStoragePlugin,
} from '@rozenite/storage-plugin'
import { useReactNavigationDevTools } from '@rozenite/react-navigation-plugin'
import { useNavigationContainerRef } from '@react-navigation/native'
import { useAppTheme } from './useAppTheme'
import { queryClient } from '@/utils/queryClient'
import { storage } from '@/store'

// Initialize Uniwind insets synchronously at module load
if (initialWindowMetrics?.insets) {
  Uniwind.updateInsets(initialWindowMetrics.insets)
}

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active')
  }
}

export function useAppInit() {
  const { mode, theme, isDark } = useAppTheme()
  const insets = useSafeAreaInsets()
  const navigationRef = useNavigationContainerRef<any>()

  // Rozenite DevTools
  useTanStackQueryDevTools(queryClient)
  useRozeniteStoragePlugin({
    storages: [
      createMMKVStorageAdapter({
        storages: { mmkv: storage },
      }),
    ],
  })
  useReactNavigationDevTools({ ref: navigationRef })

  // Sync theme to Uniwind
  useEffect(() => {
    Uniwind.setTheme(mode)
  }, [mode])

  // Sync safe area insets to Uniwind (rotation, foldables, orientation)
  useEffect(() => {
    Uniwind.updateInsets(insets)
  }, [insets.top, insets.bottom, insets.left, insets.right])

  useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange)
    return () => subscription.remove()
  }, [])

  return {
    isDark,
    theme,
    mode,
    navigationRef,
  }
}
