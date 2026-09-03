import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '@/components';
import { useThemeStore } from '@/store';
import { useUniwind } from 'uniwind';
import { ThemeMode } from '@/theme';

const THEME_OPTIONS: Array<{ mode: ThemeMode; label: string }> = [
  { mode: 'system', label: 'System' },
  { mode: 'light', label: 'Light' },
  { mode: 'dark', label: 'Dark' },
];

export function AccountScreen() {
  const insets = useSafeAreaInsets();
  const { mode, setMode } = useThemeStore();
  const { theme } = useUniwind();

  return (
    <View
      className="flex-1 bg-white dark:bg-[#1E1E1E] px-5"
      style={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom }}
    >
      <Text className="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight mb-6">
        Settings
      </Text>

      {/* User Profile Card */}
      <View className="flex-row items-center bg-neutral-100 dark:bg-[#282828] p-4 rounded-3xl mb-6">
        <Avatar
          uri="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
          name="Devon Robinson"
          size={56}
          isOnline
        />
        <View className="ml-4 flex-1">
          <Text className="text-lg font-bold text-neutral-900 dark:text-white">
            Devon Robinson
          </Text>
          <Text className="text-sm text-neutral-500 dark:text-neutral-400">
            devon@example.com
          </Text>
        </View>
      </View>

      {/* Theme Section */}
      <View className="bg-neutral-100 dark:bg-[#282828] p-4 rounded-3xl">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-base font-bold text-neutral-900 dark:text-white">
            Appearance
          </Text>
          <Text className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            Active: {theme}
          </Text>
        </View>

        <View className="flex-row bg-white dark:bg-[#1E1E1E] p-1 rounded-2xl">
          {THEME_OPTIONS.map(item => {
            const isSelected = mode === item.mode;
            return (
              <Pressable
                key={item.mode}
                onPress={() => setMode(item.mode)}
                className={`flex-1 py-2.5 rounded-xl items-center justify-center ${
                  isSelected
                    ? 'bg-neutral-900 dark:bg-white shadow-sm'
                    : 'bg-transparent'
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${
                    isSelected
                      ? 'text-white dark:text-neutral-900'
                      : 'text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}
