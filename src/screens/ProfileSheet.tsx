import React from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AnimatedButton } from '@/components';

export function ProfileSheet() {
  const navigation = useNavigation();

  return (
    <View className="bg-white dark:bg-neutral-900 p-6 gap-6 rounded-t-3xl">
      <View className="gap-2">
        <Text className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
          Native Form Sheet
        </Text>
        <Text className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
          Powered by iOS <Text className="font-mono text-xs">UIModalPresentationFormSheet</Text> & Android <Text className="font-mono text-xs">BottomSheetBehavior</Text> with zero JS animation overhead.
        </Text>
      </View>

      <View className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-xl gap-2">
        <Text className="text-xs font-bold uppercase tracking-wider text-neutral-400">
          Sheet Configuration
        </Text>
        <Text className="text-sm text-neutral-700 dark:text-neutral-200">
          • Detents: <Text className="font-semibold">fitToContents</Text>
        </Text>
        <Text className="text-sm text-neutral-700 dark:text-neutral-200">
          • Native Grabber: <Text className="font-semibold">Visible</Text>
        </Text>
      </View>

      <AnimatedButton
        label="Dismiss Sheet"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
}
