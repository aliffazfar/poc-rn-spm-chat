import React, { forwardRef, ComponentRef } from 'react'
import { TextInput, TextInputProps, StyleSheet } from 'react-native'

export interface InputProps extends TextInputProps {
  className?: string
  placeholderTextColorClassName?: string
}

export const Input = forwardRef<ComponentRef<typeof TextInput>, InputProps>(
  function Input(
    {
      className = '',
      placeholderTextColorClassName = 'accent-neutral-400 dark:accent-neutral-500',
      style,
      ...props
    },
    ref,
  ) {
    return (
      <TextInput
        ref={ref}
        className={`text-base leading-5 text-neutral-900 dark:text-neutral-100 p-0 ${className}`}
        placeholderTextColorClassName={placeholderTextColorClassName}
        style={[styles.input, style]}
        {...props}
      />
    )
  },
)

const styles = StyleSheet.create({
  input: {
    paddingVertical: 0,
  },
})
