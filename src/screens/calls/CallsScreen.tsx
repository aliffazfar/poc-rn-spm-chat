import React, { useMemo, useRef } from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import { LegendList } from '@legendapp/list/react-native'
import {
  CallLogRow,
  getCallDirectionLabel,
  Screen,
  TabHeader,
  toast,
} from '@/components'
import type { CallDirection, CallMode } from '@/components'
import { useAppTheme } from '@/hooks'
import { useInfiniteUsers, type User } from '@/api'

interface CallLog {
  id: string
  user: User
  direction: CallDirection
  mode: CallMode
  time: string
  duration?: string
}

type CallListItem =
  | { kind: 'section'; id: 'recent'; title: 'Recent' }
  | { kind: 'empty'; id: 'empty' }
  | { kind: 'call'; id: string; call: CallLog }

const CALL_SCENARIOS: Array<{
  direction: CallDirection
  mode: CallMode
  duration?: string
}> = [
  { direction: 'incoming', mode: 'audio', duration: '4 min' },
  { direction: 'outgoing', mode: 'video', duration: '12 min' },
  { direction: 'missed', mode: 'audio' },
  { direction: 'outgoing', mode: 'audio', duration: '8 min' },
  { direction: 'incoming', mode: 'video', duration: '26 min' },
  { direction: 'missed', mode: 'video' },
]

const CALL_TIMES = [
  'Today, 10:42 AM',
  'Today, 9:18 AM',
  'Today, 8:05 AM',
  'Yesterday, 6:44 PM',
  'Yesterday, 4:30 PM',
  'Yesterday, 11:20 AM',
]

function createCallLogs(users: User[]): CallLog[] {
  return users.map((user, index) => {
    const scenario = CALL_SCENARIOS[index % CALL_SCENARIOS.length]

    return {
      id: `${user.id}-${index}`,
      user,
      ...scenario,
      time: CALL_TIMES[index % CALL_TIMES.length],
    }
  })
}

export function CallsScreen() {
  const { colors } = useAppTheme()
  const hasUserScrolled = useRef(false)
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteUsers()

  const users = useMemo(
    () => data?.pages.flatMap((page) => page.results) ?? [],
    [data],
  )
  const callLogs = useMemo(() => createCallLogs(users), [users])
  const listData = useMemo<CallListItem[]>(
    () => [
      { kind: 'section', id: 'recent', title: 'Recent' },
      ...(callLogs.length > 0
        ? callLogs.map((call) => ({
            kind: 'call' as const,
            id: call.id,
            call,
          }))
        : [{ kind: 'empty' as const, id: 'empty' as const }]),
    ],
    [callLogs],
  )
  const showInitialLoader = isLoading && callLogs.length === 0

  return (
    <Screen>
      <TabHeader
        title="Calls"
        actions={[
          {
            icon: 'search',
            onPress: () =>
              toast.info('Search calls', {
                description: 'Search your recent calls',
              }),
          },
          {
            icon: 'more',
            onPress: () =>
              toast.info('Call settings', {
                description: 'Manage call notifications and privacy',
              }),
          },
        ]}
      />

      {showInitialLoader ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      ) : (
        <LegendList
          data={listData}
          keyExtractor={(item) => item.id}
          recycleItems
          estimatedItemSize={76}
          drawDistance={50}
          getItemType={(item) => item.kind}
          getFixedItemSize={(item) => {
            if (item.kind === 'call') return 76
            if (item.kind === 'section') return 48
            return undefined
          }}
          showsVerticalScrollIndicator={false}
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
              <View className="items-center py-4">
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            ) : undefined
          }
          renderItem={({ item }: { item: CallListItem }) => {
            if (item.kind === 'section') {
              return (
                <Text className="px-5 pt-5 pb-1 text-base font-bold text-neutral-900 dark:text-white">
                  {item.title}
                </Text>
              )
            }

            if (item.kind === 'empty') {
              return isLoading ? (
                <View className="items-center py-16">
                  <ActivityIndicator size="small" color={colors.primary} />
                </View>
              ) : (
                <View className="items-center py-16">
                  <Text className="text-base font-medium text-neutral-400 dark:text-neutral-500">
                    No recent calls
                  </Text>
                </View>
              )
            }

            const call = item.call

            return (
              <CallLogRow
                avatar={call.user.avatar}
                name={call.user.name}
                direction={call.direction}
                mode={call.mode}
                time={call.time}
                duration={call.duration}
                onPress={() =>
                  toast.info(`${call.user.name}'s call`, {
                    description: `${getCallDirectionLabel(call.direction)}${call.duration ? ` · ${call.duration}` : ''}`,
                  })
                }
                onCallPress={() =>
                  toast.success(
                    `${call.mode === 'video' ? 'Video' : 'Audio'} call`,
                    { description: `Calling ${call.user.name}` },
                  )
                }
              />
            )
          }}
        />
      )}
    </Screen>
  )
}
