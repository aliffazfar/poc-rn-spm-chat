import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Avatar, AvatarSize } from '../atoms/Avatar';
import { Check, CheckCheck } from '@/components/icons';

export interface ChatCardProps {
  id?: string | number;
  avatar?: string;
  name: string;
  message?: string;
  time?: string;
  unreadCount?: number;
  status?: 'sent' | 'delivered' | 'read' | 'none';
  isOnline?: boolean;
  avatarSize?: AvatarSize | number;
  onPress?: () => void;
  className?: string;
}

export function ChatCard({
  avatar,
  name,
  message,
  time,
  unreadCount,
  status = 'none',
  isOnline,
  avatarSize = 52,
  onPress,
  className = '',
}: ChatCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center px-5 py-3 active:bg-neutral-50 dark:active:bg-neutral-800/50 ${className}`}
    >
      <Avatar uri={avatar} name={name} size={avatarSize} isOnline={isOnline} />
      <View className="flex-1 ml-3.5 justify-center">
        <View className="flex-row justify-between items-center mb-1">
          <Text
            className="text-base font-semibold text-neutral-900 dark:text-neutral-50"
            numberOfLines={1}
          >
            {name}
          </Text>
          {time ? (
            <Text className="text-xs text-neutral-400 dark:text-neutral-500 font-medium ml-2">
              {time}
            </Text>
          ) : null}
        </View>
        <View className="flex-row justify-between items-center">
          <Text
            className="text-sm text-neutral-500 dark:text-neutral-400 flex-1 mr-3"
            numberOfLines={1}
          >
            {message}
          </Text>
          {unreadCount && unreadCount > 0 ? (
            <View className="w-5 h-5 rounded-full bg-neutral-900 dark:bg-white items-center justify-center">
              <Text className="text-white dark:text-neutral-900 text-[11px] font-bold">
                {unreadCount}
              </Text>
            </View>
          ) : status === 'read' || status === 'delivered' ? (
            <CheckCheck size={16} color="#6B7280" strokeWidth={2} />
          ) : status === 'sent' ? (
            <Check size={16} color="#9CA3AF" strokeWidth={2} />
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}
