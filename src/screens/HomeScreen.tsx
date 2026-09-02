import React, { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { AnimatedButton } from '@/components/AnimatedButton';
import { EnvCard } from '@/components/EnvCard';
import { Header } from '@/components/Header';
import { getAppConfig } from '@/utils/config';

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [count, setCount] = useState(0);
  const configItems = getAppConfig();

  return (
    <View
      className="flex-1 bg-neutral-50 dark:bg-neutral-950 px-6 justify-between"
      style={{
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 16,
      }}
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
    </View>
  );
}

