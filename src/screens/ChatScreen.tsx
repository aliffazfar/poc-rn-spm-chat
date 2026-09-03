import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Camera, EllipsisVertical, Archive } from '@/components/icons';
import { SearchBar, ChatCard } from '@/components';
import { useChatStore } from '@/store';
import { useInfiniteUsers } from '@/api';
import { useUniwind } from 'uniwind';

export function ChatScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { activeFilter, setActiveFilter } = useChatStore();
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteUsers(searchQuery);

  const users = useMemo(() => {
    const all = data?.pages.flatMap(page => page.results) ?? [];
    if (activeFilter === 'unread') {
      return all.filter(u => u.id % 2 === 1);
    }
    if (activeFilter === 'group') {
      return all.filter(u => u.id % 3 === 0);
    }
    return all;
  }, [data, activeFilter]);

  const { theme } = useUniwind();
  const isDark = theme === 'dark';

  return (
    <View
      className="flex-1 bg-white dark:bg-[#1E1E1E]"
      style={{ paddingTop: insets.top }}
    >
      {/* Top Header */}
      <View className="flex-row items-center justify-between px-5 pt-3 pb-2">
        <Text className="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Chats
        </Text>
        <View className="flex-row items-center gap-5">
          <Pressable hitSlop={10} className="active:opacity-60">
            <Camera
              size={24}
              color={isDark ? '#FFFFFF' : '#171717'}
              strokeWidth={1.75}
            />
          </Pressable>
          <Pressable hitSlop={10} className="active:opacity-60">
            <EllipsisVertical
              size={24}
              color={isDark ? '#FFFFFF' : '#171717'}
              strokeWidth={1.75}
            />
          </Pressable>
        </View>
      </View>

      {/* Search Bar */}
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

      {/* Filter Tabs */}
      <View className="flex-row px-5 py-2 gap-2">
        <Pressable
          onPress={() => setActiveFilter('all')}
          className={`px-4 py-1.5 rounded-full ${
            activeFilter === 'all'
              ? 'bg-neutral-900 dark:bg-white'
              : 'bg-neutral-100 dark:bg-neutral-800'
          }`}
        >
          <Text
            className={`text-sm font-semibold ${
              activeFilter === 'all'
                ? 'text-white dark:text-neutral-900'
                : 'text-neutral-700 dark:text-neutral-300'
            }`}
          >
            All
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setActiveFilter('unread')}
          className={`flex-row items-center px-4 py-1.5 rounded-full gap-1.5 ${
            activeFilter === 'unread'
              ? 'bg-neutral-900 dark:bg-white'
              : 'bg-neutral-100 dark:bg-neutral-800'
          }`}
        >
          <Text
            className={`text-sm font-semibold ${
              activeFilter === 'unread'
                ? 'text-white dark:text-neutral-900'
                : 'text-neutral-700 dark:text-neutral-300'
            }`}
          >
            Unread
          </Text>
          <Text
            className={`text-xs ${
              activeFilter === 'unread'
                ? 'text-neutral-300 dark:text-neutral-600'
                : 'text-neutral-400 dark:text-neutral-500'
            }`}
          >
            {users.length}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setActiveFilter('group')}
          className={`px-4 py-1.5 rounded-full ${
            activeFilter === 'group'
              ? 'bg-neutral-900 dark:bg-white'
              : 'bg-neutral-100 dark:bg-neutral-800'
          }`}
        >
          <Text
            className={`text-sm font-semibold ${
              activeFilter === 'group'
                ? 'text-white dark:text-neutral-900'
                : 'text-neutral-700 dark:text-neutral-300'
            }`}
          >
            Groups
          </Text>
        </Pressable>
      </View>

      {/* Archived Row */}
      <Pressable className="flex-row items-center justify-between px-5 py-3 border-b border-neutral-100 dark:border-neutral-800/80 active:bg-neutral-50 dark:active:bg-neutral-800/50">
        <View className="flex-row items-center gap-3.5">
          <Archive
            size={20}
            color={isDark ? '#A3A3A3' : '#171717'}
            strokeWidth={1.75}
          />
          <Text className="text-base font-semibold text-neutral-900 dark:text-white">
            Archived
          </Text>
        </View>
        <Text className="text-sm font-medium text-neutral-400 dark:text-neutral-500">
          13
        </Text>
      </Pressable>

      {/* Chat List */}
      <FlatList
        data={users}
        keyExtractor={item => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-20"
        onRefresh={refetch}
        refreshing={isRefetching}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View className="py-4 items-center">
              <ActivityIndicator
                size="small"
                color={isDark ? '#FFFFFF' : '#171717'}
              />
            </View>
          ) : undefined
        }
        ListEmptyComponent={
          !isLoading ? (
            <View className="items-center justify-center py-16">
              <Text className="text-base text-neutral-400 dark:text-neutral-500 font-medium">
                No chats found
              </Text>
            </View>
          ) : (
            <View className="items-center justify-center py-16">
              <ActivityIndicator
                size="large"
                color={isDark ? '#FFFFFF' : '#171717'}
              />
            </View>
          )
        }
        renderItem={({ item, index }) => (
          <ChatCard
            id={item.id}
            avatar={item.avatar}
            name={item.name}
            time={`08:${String(10 + (index % 50)).padStart(2, '0')}`}
            message={
              item.address
                ? `${item.address.city} • @${item.username}`
                : item.email
            }
            unreadCount={index % 3 === 0 ? (index % 4) + 1 : undefined}
            status={index % 2 === 0 ? 'delivered' : 'sent'}
            onPress={() =>
              navigation.navigate('Conversation', {
                chatId: item.id,
                name: item.name,
                avatar: item.avatar,
              })
            }
          />
        )}
      />
    </View>
  );
}
