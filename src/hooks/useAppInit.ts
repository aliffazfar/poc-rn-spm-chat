import { useEffect } from 'react';
import { AppState, type AppStateStatus, Platform } from 'react-native';
import { focusManager } from '@tanstack/react-query';
import { Uniwind, useUniwind } from 'uniwind';
import { useTanStackQueryDevTools } from '@rozenite/tanstack-query-plugin';
import {
  createMMKVStorageAdapter,
  useRozeniteStoragePlugin,
} from '@rozenite/storage-plugin';
import { useThemeStore } from '@/store';
import { queryClient } from '@/utils/queryClient';
import { storage } from '@/storage';

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

export function useAppInit() {
  const mode = useThemeStore(s => s.mode);
  const { theme } = useUniwind();
  const isDark = theme === 'dark';

  // Rozenite DevTools
  useTanStackQueryDevTools(queryClient);
  useRozeniteStoragePlugin({
    storages: [
      createMMKVStorageAdapter({
        storages: { mmkv: storage },
      }),
    ],
  });

  useEffect(() => {
    Uniwind.setTheme(mode);
  }, [mode]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange);
    return () => subscription.remove();
  }, []);

  return {
    isDark,
    theme,
    mode,
  };
}
