import '../global.css';
import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { Navigation, appLightTheme, appDarkTheme } from '@/navigation';
import { queryClient, clientPersister } from '@/utils/queryClient';
import { useAppInit } from '@/hooks';

function AppRoot() {
  const { isDark } = useAppInit();

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <Navigation theme={isDark ? appDarkTheme : appLightTheme} />
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: clientPersister }}
    >
      <AppRoot />
    </PersistQueryClientProvider>
  );
}
