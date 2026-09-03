import React from 'react'
import { View, ViewProps } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export const SCREEN_HORIZONTAL_PADDING = 20

export interface ScreenProps extends ViewProps {
  children: React.ReactNode
  className?: string
  edges?: Array<'top' | 'bottom'>
  padded?: boolean
}

export function Screen({
  children,
  className = '',
  edges = ['top'],
  padded = false,
  style,
  ...props
}: ScreenProps) {
  const insets = useSafeAreaInsets()

  return (
    <View
      className={`flex-1 bg-white dark:bg-[#1E1E1E] ${className}`}
      style={[
        {
          paddingTop: edges.includes('top') ? insets.top : 0,
          paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
          paddingHorizontal: padded ? SCREEN_HORIZONTAL_PADDING : 0,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  )
}
