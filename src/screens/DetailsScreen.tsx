import React from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { AnimatedButton } from '@/components/AnimatedButton';

export function DetailsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <View
      className="flex-1 bg-neutral-50 dark:bg-neutral-950 px-6 justify-between"
      style={{
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 16,
      }}
    >
      <View className="gap-3">
        <Text className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
          Details Screen
        </Text>
        <Text className="text-sm text-neutral-500 dark:text-neutral-400">
          Native Stack transition powered by react-native-screens & React Navigation 7.
        </Text>
      </View>

      <AnimatedButton
        label="Go Back"
        onPress={() => navigation.goBack()}
        subtitle="Return to Home Screen"
      />
    </View>
  );
}
