import React from 'react';
import { View, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { Plus, Smile, SendHorizontal } from '@/components/icons';

export interface MessageInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onPressPlus?: () => void;
  onPressSmile?: () => void;
  isSending?: boolean;
  placeholder?: string;
  bottomInset?: number;
}

import { useUniwind } from 'uniwind';

export function MessageInput({
  value,
  onChangeText,
  onSend,
  onPressPlus,
  onPressSmile,
  isSending = false,
  placeholder = 'Message...',
  bottomInset = 12,
}: MessageInputProps) {
  const { theme } = useUniwind();
  const isDark = theme === 'dark';
  const canSend = value.trim().length > 0 && !isSending;

  return (
    <View
      className="flex-row items-center px-4 py-2 bg-white dark:bg-[#1E1E1E] border-t border-neutral-100 dark:border-neutral-800 gap-2.5"
      style={{ paddingBottom: Math.max(bottomInset, 12) }}
    >
      <Pressable
        onPress={onPressPlus}
        hitSlop={8}
        className="p-1 active:opacity-60"
      >
        <Plus
          size={26}
          color={isDark ? '#A3A3A3' : '#737373'}
          strokeWidth={2}
        />
      </Pressable>

      <View className="flex-1 flex-row items-center bg-neutral-100 dark:bg-[#282828] rounded-full px-4 py-2">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSend}
          className="flex-1 text-base text-neutral-900 dark:text-white p-0"
          placeholder={placeholder}
          placeholderTextColorClassName="accent-neutral-400 dark:accent-neutral-500"
        />
        <Pressable
          onPress={onPressSmile}
          hitSlop={6}
          className="ml-2 active:opacity-60"
        >
          <Smile
            size={22}
            color={isDark ? '#A3A3A3' : '#737373'}
            strokeWidth={1.75}
          />
        </Pressable>
      </View>

      <Pressable
        onPress={onSend}
        disabled={!canSend}
        className={`w-11 h-11 rounded-full ${
          canSend
            ? 'bg-neutral-900 dark:bg-white'
            : 'bg-neutral-300 dark:bg-neutral-700'
        } items-center justify-center active:opacity-80`}
      >
        {isSending ? (
          <ActivityIndicator
            size="small"
            color={canSend && isDark ? '#171717' : '#FFFFFF'}
          />
        ) : (
          <SendHorizontal
            size={18}
            color={canSend && isDark ? '#171717' : '#FFFFFF'}
            strokeWidth={2.2}
          />
        )}
      </Pressable>
    </View>
  );
}
