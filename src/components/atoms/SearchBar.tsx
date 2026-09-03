import React from 'react';
import { View, TextInput, TextInputProps } from 'react-native';
import { Search } from '@/components/icons';

export interface SearchBarProps extends TextInputProps {
  containerClassName?: string;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search',
  containerClassName = '',
  ...rest
}: SearchBarProps) {
  return (
    <View className={`px-5 py-2.5 ${containerClassName}`}>
      <View className="flex-row items-center bg-neutral-100 dark:bg-neutral-800 rounded-2xl px-3.5 py-2.5">
        <Search size={18} color="#9CA3AF" strokeWidth={2} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          className="flex-1 text-base text-neutral-900 dark:text-neutral-100 ml-2.5 p-0"
          placeholder={placeholder}
          placeholderTextColorClassName="accent-neutral-400 dark:accent-neutral-500"
          {...rest}
        />
      </View>
    </View>
  );
}
