import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  TextInput,
} from 'react-native';
import TurboImage from 'react-native-turbo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  Camera,
  EllipsisVertical,
  Search,
  Archive,
  Check,
  CheckCheck,
} from '@/components/icons';
import { useChatStore } from '@/store';

interface ChatItem {
  id: string;
  name: string;
  message: string;
  time: string;
  unreadCount?: number;
  status?: 'sent' | 'delivered' | 'read' | 'none';
  avatar: string;
}

const MOCK_CHATS: ChatItem[] = [
  {
    id: '1',
    name: 'Devon Robinson',
    message: "Let's catch up tomorrow",
    time: '08:00',
    unreadCount: 1,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: '2',
    name: 'John Alex',
    message: 'See you at the meeting!',
    time: '08:00',
    status: 'sent',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: '3',
    name: 'William Lee',
    message: 'Can we reschedule?',
    time: '08:00',
    status: 'delivered',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: '4',
    name: 'Sophia Davis',
    message: 'Thanks for the update.',
    time: '08:00',
    status: 'read',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: '5',
    name: 'Liam Carter',
    message: "Don't forget our call.",
    time: '08:00',
    status: 'none',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: '6',
    name: 'Olivia Brown',
    message: "I'll send the files soon.",
    time: '08:00',
    status: 'none',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: '7',
    name: 'Emma Johnson',
    message: "I've sent the presentation file.",
    time: '08:00',
    status: 'none',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: '8',
    name: 'Kevin Nash',
    message: 'What time is our meeting tomorrow?',
    time: '08:00',
    status: 'none',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
  },
];

export function ChatScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { activeFilter, setActiveFilter } = useChatStore();

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      {/* Top Header */}
      <View className="flex-row items-center justify-between px-5 pt-3 pb-2">
        <Text className="text-3xl font-extrabold text-neutral-900 tracking-tight">
          Chats
        </Text>
        <View className="flex-row items-center gap-5">
          <Pressable hitSlop={10} className="active:opacity-60">
            <Camera size={24} color="#171717" strokeWidth={1.75} />
          </Pressable>
          <Pressable hitSlop={10} className="active:opacity-60">
            <EllipsisVertical size={24} color="#171717" strokeWidth={1.75} />
          </Pressable>
        </View>
      </View>

      {/* Search Bar */}
      <View className="px-5 py-2.5">
        <View className="flex-row items-center bg-neutral-100 rounded-2xl px-3.5 py-2.5">
          <Search size={18} color="#9CA3AF" strokeWidth={2} />
          <TextInput
            className="flex-1 text-base text-neutral-900 ml-2.5 p-0"
            placeholder="Search"
            placeholderTextColorClassName="accent-neutral-400"
          />
        </View>
      </View>

      {/* Filter Tabs */}
      <View className="flex-row px-5 py-2 gap-2">
        <Pressable
          onPress={() => setActiveFilter('all')}
          className={`px-4 py-1.5 rounded-full ${
            activeFilter === 'all' ? 'bg-neutral-900' : 'bg-neutral-100'
          }`}
        >
          <Text
            className={`text-sm font-semibold ${
              activeFilter === 'all' ? 'text-white' : 'text-neutral-700'
            }`}
          >
            All
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setActiveFilter('unread')}
          className={`flex-row items-center px-4 py-1.5 rounded-full gap-1.5 ${
            activeFilter === 'unread' ? 'bg-neutral-900' : 'bg-neutral-100'
          }`}
        >
          <Text
            className={`text-sm font-semibold ${
              activeFilter === 'unread' ? 'text-white' : 'text-neutral-700'
            }`}
          >
            Unread
          </Text>
          <Text
            className={`text-xs ${
              activeFilter === 'unread' ? 'text-neutral-300' : 'text-neutral-400'
            }`}
          >
            22
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setActiveFilter('group')}
          className={`px-4 py-1.5 rounded-full ${
            activeFilter === 'group' ? 'bg-neutral-900' : 'bg-neutral-100'
          }`}
        >
          <Text
            className={`text-sm font-semibold ${
              activeFilter === 'group' ? 'text-white' : 'text-neutral-700'
            }`}
          >
            Group
          </Text>
        </Pressable>
      </View>

      {/* Archived Row */}
      <Pressable className="flex-row items-center justify-between px-5 py-3 border-b border-neutral-100 active:bg-neutral-50">
        <View className="flex-row items-center gap-3.5">
          <Archive size={20} color="#171717" strokeWidth={1.75} />
          <Text className="text-base font-semibold text-neutral-900">Archived</Text>
        </View>
        <Text className="text-sm font-medium text-neutral-400">13</Text>
      </Pressable>

      {/* Chat List */}
      <FlatList
        data={MOCK_CHATS}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-20"
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate('Conversation', { chatId: item.id, name: item.name, avatar: item.avatar })}
            className="flex-row items-center px-5 py-3 active:bg-neutral-50"
          >
            <TurboImage
              source={{ uri: item.avatar }}
              style={{ width: 52, height: 52, backgroundColor: '#E5E5E5' }}
              resize={150}
              resizeMode="cover"
              rounded
              fadeDuration={0}
            />
            <View className="flex-1 ml-3.5 justify-center">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-base font-semibold text-neutral-900">
                  {item.name}
                </Text>
                <Text className="text-xs text-neutral-400 font-medium">
                  {item.time}
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text
                  className="text-sm text-neutral-500 flex-1 mr-3"
                  numberOfLines={1}
                >
                  {item.message}
                </Text>
                {item.unreadCount ? (
                  <View className="w-5 h-5 rounded-full bg-neutral-900 items-center justify-center">
                    <Text className="text-white text-[11px] font-bold">
                      {item.unreadCount}
                    </Text>
                  </View>
                ) : item.status === 'read' || item.status === 'delivered' ? (
                  <CheckCheck size={16} color="#6B7280" strokeWidth={2} />
                ) : item.status === 'sent' ? (
                  <Check size={16} color="#9CA3AF" strokeWidth={2} />
                ) : null}
              </View>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}
