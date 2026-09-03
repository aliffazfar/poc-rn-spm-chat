import React from 'react'
import { View } from 'react-native'
import { Skeleton } from '../atoms/Skeleton'

export function ChatCardSkeleton() {
  return (
    <View className="flex-row items-center px-5 py-3">
      {/* Avatar placeholder matching 52px Avatar */}
      <Skeleton className="w-[52px] h-[52px] rounded-full" />

      {/* Info lines matching ChatCard title and subtitle */}
      <View className="flex-1 ml-3.5 justify-center">
        <View className="flex-row justify-between items-center mb-2">
          <Skeleton className="w-28 h-4 rounded-md" />
          <Skeleton className="w-10 h-3 rounded-md" />
        </View>
        <Skeleton className="w-48 h-3.5 rounded-md" />
      </View>
    </View>
  )
}
