import React from 'react'
import { View } from 'react-native'
import { Search } from '@/components/icons'
import { Input, InputProps } from './Input'

export interface SearchBarProps extends InputProps {
  containerClassName?: string
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
        <Input
          value={value}
          onChangeText={onChangeText}
          className="flex-1 ml-2.5"
          placeholder={placeholder}
          {...rest}
        />
      </View>
    </View>
  )
}
