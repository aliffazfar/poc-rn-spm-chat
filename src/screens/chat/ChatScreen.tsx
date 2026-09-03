import React, { useMemo, useRef, useState } from 'react'
import { View, Text, Pressable, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Archive } from '@/components/icons'
import {
  Screen,
  TabHeader,
  SearchBar,
  ChatCard,
  ChatCardSkeleton,
  toast,
} from '@/components'
import { useChatStore } from '@/store'
import { useAppTheme } from '@/hooks'
import { useInfiniteUsers, postKeys } from '@/api'
import type { User } from '@/api'
import { useQueryClient } from '@tanstack/react-query'
import { LegendList } from '@legendapp/list/react-native'
import { getInitialLastMessage } from './mock'

type ChatListItem =
  | { kind: 'search'; id: 'search' }
  | { kind: 'filters'; id: 'filters' }
  | { kind: 'archived'; id: 'archived' }
  | { kind: 'skeleton'; id: string }
  | { kind: 'empty'; id: 'empty' }
  | { kind: 'user'; id: string; user: User }

export function ChatScreen() {
  const navigation = useNavigation<any>()
  const queryClient = useQueryClient()
  const hasUserScrolled = useRef(false)
  const { activeFilter, setActiveFilter } = useChatStore()
  const { colors } = useAppTheme()
  const [searchQuery, setSearchQuery] = useState('')

  const {
    data,
    isLoading,
    isRefetching,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteUsers(searchQuery)

  const users = useMemo(() => {
    const all = data?.pages.flatMap((page) => page.results) ?? []
    if (activeFilter === 'unread') {
      return all.filter((u) => u.id % 2 === 1)
    }
    if (activeFilter === 'group') {
      return all.filter((u) => u.id % 3 === 0)
    }
    return all
  }, [data, activeFilter])

  const showLoadingRows =
    !isError && users.length === 0 && (!data || isLoading || isRefetching)

  const listData = useMemo<ChatListItem[]>(
    () => [
      { kind: 'search', id: 'search' },
      { kind: 'filters', id: 'filters' },
      { kind: 'archived', id: 'archived' },
      ...(users.length > 0
        ? users.map((user) => ({
            kind: 'user' as const,
            id: String(user.id),
            user,
          }))
        : showLoadingRows
          ? Array.from({ length: 8 }, (_, index) => ({
              kind: 'skeleton' as const,
              id: `skeleton-${index}`,
            }))
          : [{ kind: 'empty' as const, id: 'empty' as const }]),
    ],
    [showLoadingRows, users],
  )

  return (
    <Screen edges={['top']} className="flex-1">
      <TabHeader
        title="Chats"
        actions={[
          {
            icon: 'camera',
            onPress: () =>
              toast.info('Camera', {
                description: 'Take photo or record video',
              }),
          },
          {
            icon: 'more',
            onPress: () =>
              toast.info('More options', {
                description: 'New group, starred messages, settings',
              }),
          },
        ]}
      />

      <LegendList
        data={listData}
        keyExtractor={(item) => item.id}
        recycleItems
        estimatedItemSize={56}
        drawDistance={50}
        getItemType={(item) => item.kind}
        getFixedItemSize={(item) =>
          item.kind === 'user' || item.kind === 'skeleton' ? 76 : undefined
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        className="flex-1"
        onRefresh={refetch}
        refreshing={isRefetching}
        onScrollBeginDrag={() => {
          hasUserScrolled.current = true
        }}
        onEndReached={() => {
          if (hasUserScrolled.current && hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
          }
        }}
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View className="py-4 items-center">
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : undefined
        }
        renderItem={({
          item,
          index,
        }: {
          item: ChatListItem
          index: number
        }) => {
          if (item.kind === 'search') {
            return (
              <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
            )
          }

          if (item.kind === 'filters') {
            return (
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
            )
          }

          if (item.kind === 'archived') {
            return (
              <Pressable
                onPress={() =>
                  toast.info('Archived chats', {
                    description: '13 archived conversations',
                  })
                }
                className="flex-row items-center justify-between px-5 py-2.5 border-b border-neutral-100 dark:border-neutral-800/60 active:bg-neutral-50 dark:active:bg-neutral-800/50"
              >
                <View className="flex-row items-center">
                  <View className="w-[52px] items-center justify-center">
                    <Archive
                      size={18}
                      color={colors.textMuted}
                      strokeWidth={1.5}
                    />
                  </View>
                  <Text className="ml-3.5 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Archived
                  </Text>
                </View>
                <Text className="text-xs font-medium text-neutral-400 dark:text-neutral-500">
                  13
                </Text>
              </Pressable>
            )
          }

          if (item.kind === 'skeleton') {
            return <ChatCardSkeleton />
          }

          if (item.kind === 'empty') {
            return (
              <View className="items-center justify-center py-16">
                <Text className="text-base text-neutral-400 dark:text-neutral-500 font-medium">
                  No chats found
                </Text>
              </View>
            )
          }

          const cachedComments = queryClient.getQueryData<any[]>(
            postKeys.comments(item.user.id),
          )
          const lastComment =
            cachedComments && cachedComments.length > 0
              ? cachedComments[cachedComments.length - 1]
              : null

          const initial = getInitialLastMessage(item.user.id)

          const messageText =
            lastComment?.body && lastComment.body.length > 0
              ? lastComment.body
              : lastComment?.imageUrl
                ? '📷 Photo'
                : initial.message

          const messageTime = lastComment?.createdAt
            ? new Date(lastComment.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })
            : initial.time

          return (
            <ChatCard
              id={item.user.id}
              avatar={item.user.avatar}
              name={item.user.name}
              time={messageTime}
              message={messageText}
              unreadCount={index % 3 === 0 ? (index % 4) + 1 : undefined}
              status={index % 2 === 0 ? 'delivered' : 'sent'}
              onPress={() =>
                navigation.navigate('Conversation', {
                  chatId: item.user.id,
                })
              }
            />
          )
        }}
      />
    </Screen>
  )
}
