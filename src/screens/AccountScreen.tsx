import React from 'react';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function AccountScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-white px-6 justify-center items-center"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <Text className="text-2xl font-bold text-neutral-900">Account</Text>
      <Text className="text-sm text-neutral-500 mt-2">Settings & Profile</Text>
    </View>
  );
}
