import React, { useMemo, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StatusBar,
  Text,
  View,
  useWindowDimensions,
} from 'react-native'
import { LegendList } from '@legendapp/list/react-native'
import TurboImage from 'react-native-turbo-image'
import {
  Avatar,
  Screen,
  StatusProgressBar,
  TabHeader,
  Toaster,
  toast,
} from '@/components'
import {
  ChevronLeft,
  EllipsisVertical,
  Plus,
  SendHorizontal,
} from '@/components/icons'
import { useAppTheme } from '@/hooks'
import { useInfiniteUsers } from '@/api'
import {
  buildStatusList,
  createStatusContacts,
  MY_STATUS,
  type StatusContact,
  type StatusListItem,
} from './mock'

interface SelectedStatus {
  contact: StatusContact
  index: number
}

function StatusRing({
  contact,
  size = 52,
}: {
  contact: StatusContact
  size?: number
}) {
  const viewed = contact.statuses.every((status) => status.viewed)

  return (
    <View
      className={`items-center justify-center rounded-full border-[3px] p-0.5 ${
        viewed
          ? 'border-neutral-300 dark:border-neutral-700'
          : 'border-neutral-900 dark:border-white'
      }`}
      style={{ width: size + 8, height: size + 8 }}
    >
      <Avatar
        uri={contact.avatar}
        name={contact.name}
        size={size}
        blurhash={contact.avatarBlurhash}
      />
    </View>
  )
}

function StatusList({
  contacts,
  isLoading,
  isFetchingNextPage,
  onEndReached,
  onSelect,
}: {
  contacts: StatusContact[]
  isLoading: boolean
  isFetchingNextPage: boolean
  onEndReached: () => void
  onSelect: (contact: StatusContact) => void
}) {
  const { colors } = useAppTheme()
  const hasUserScrolled = useRef(false)
  const statusList = useMemo(() => buildStatusList(contacts), [contacts])
  const showInitialLoader = isLoading && contacts.length === 0

  return (
    <Screen>
      <TabHeader
        title="Status"
        actions={[
          {
            icon: 'search',
            onPress: () =>
              toast.info('Search status', {
                description: 'Search status updates',
              }),
          },
          {
            icon: 'more',
            onPress: () =>
              toast.info('Status options', {
                description: 'Privacy and status settings',
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
          data={statusList}
          keyExtractor={(item) => item.id}
          recycleItems
          estimatedItemSize={80}
          drawDistance={50}
          getItemType={(item) => item.type}
          getFixedItemSize={(item) => {
            if (item.type === 'my-status') return 76
            if (item.type === 'status') return 80
            if (item.type === 'section') return 48
            return undefined
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          onScrollBeginDrag={() => {
            hasUserScrolled.current = true
          }}
          onEndReached={() => {
            if (hasUserScrolled.current) onEndReached()
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View className="items-center py-4">
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            ) : undefined
          }
          renderItem={({ item }: { item: StatusListItem }) => {
            if (item.type === 'my-status') {
              return (
                <Pressable
                  onPress={() =>
                    toast.info('My Status', {
                      description: 'Add a photo or video update',
                    })
                  }
                  className="flex-row items-center py-3 active:opacity-70"
                >
                  <View className="relative">
                    <Avatar
                      uri={MY_STATUS.avatar}
                      name={MY_STATUS.name}
                      size={52}
                      blurhash={MY_STATUS.avatarBlurhash}
                    />
                    <View className="absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-white dark:border-[#1E1E1E] bg-neutral-900 dark:bg-white items-center justify-center">
                      <Plus
                        size={12}
                        color={colors.background}
                        strokeWidth={2.5}
                      />
                    </View>
                  </View>
                  <View className="ml-3.5">
                    <Text className="text-base font-bold text-neutral-900 dark:text-white">
                      {MY_STATUS.name}
                    </Text>
                    <Text className="text-sm font-medium text-neutral-400 dark:text-neutral-500 mt-0.5">
                      {MY_STATUS.time}
                    </Text>
                  </View>
                </Pressable>
              )
            }

            if (item.type === 'empty') {
              return isLoading ? (
                <View className="items-center py-12">
                  <ActivityIndicator size="small" color={colors.primary} />
                </View>
              ) : (
                <View className="items-center py-12">
                  <Text className="text-sm text-neutral-400 dark:text-neutral-500">
                    No status updates
                  </Text>
                </View>
              )
            }

            if (item.type === 'section') {
              return (
                <Text className="text-base font-bold text-neutral-900 dark:text-white mt-4 mb-2">
                  {item.title}
                </Text>
              )
            }

            return (
              <Pressable
                onPress={() => onSelect(item)}
                className="flex-row items-center py-2.5 active:opacity-70"
              >
                <StatusRing contact={item} />
                <View className="ml-3.5 flex-1">
                  <Text
                    className="text-base font-bold text-neutral-900 dark:text-white"
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  <Text className="text-sm font-medium text-neutral-400 dark:text-neutral-500 mt-0.5">
                    {item.statuses[0].time}
                  </Text>
                </View>
              </Pressable>
            )
          }}
        />
      )}
    </Screen>
  )
}

function StatusViewer({
  selected,
  onClose,
  onPrevious,
  onNext,
}: {
  selected: SelectedStatus
  onClose: () => void
  onPrevious: () => void
  onNext: () => void
}) {
  const { colors, isDark } = useAppTheme()
  const { width, height } = useWindowDimensions()
  const status = selected.contact.statuses[selected.index]
  const imageWidth = width - 24
  const imageHeight = Math.min(height * 0.78, imageWidth * 1.35)

  return (
    <Screen
      edges={['top', 'bottom']}
      style={{ backgroundColor: colors.background }}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        animated
      />
      <View className="flex-row items-center gap-3 px-4 pt-2 pb-2">
        <Pressable
          onPress={onClose}
          hitSlop={8}
          className="w-10 h-10 rounded-full items-center justify-center active:opacity-70"
          style={{ backgroundColor: colors.surface }}
        >
          <ChevronLeft size={24} color={colors.text} strokeWidth={2} />
        </Pressable>
        <View className="flex-1 flex-row gap-1">
          {selected.contact.statuses.map((item, itemIndex) => (
            <StatusProgressBar
              key={item.id}
              index={itemIndex}
              activeIndex={selected.index}
              backgroundColor={colors.border}
              fillColor={colors.primary}
              onComplete={onNext}
            />
          ))}
        </View>
        <Pressable
          hitSlop={8}
          onPress={() =>
            toast.info('Status options', { description: 'More status options' })
          }
          className="w-10 h-10 items-center justify-center active:opacity-70"
        >
          <EllipsisVertical size={22} color={colors.text} strokeWidth={2} />
        </Pressable>
      </View>

      <View className="flex-row items-center px-5 pt-1 pb-3">
        <Avatar
          uri={selected.contact.avatar}
          name={selected.contact.name}
          size={36}
          blurhash={selected.contact.avatarBlurhash}
        />
        <View className="ml-3">
          <Text className="text-sm font-bold" style={{ color: colors.text }}>
            {selected.contact.name}
          </Text>
          <Text
            className="text-xs font-medium mt-0.5"
            style={{ color: colors.textMuted }}
          >
            {status.time}
          </Text>
        </View>
      </View>

      <View className="flex-1 items-center justify-center">
        <View
          className="overflow-hidden rounded-3xl"
          style={{ width: imageWidth, height: imageHeight }}
        >
          <TurboImage
            source={{ uri: status.image }}
            placeholder={{ blurhash: status.imageBlurhash }}
            showPlaceholderOnFailure
            style={{
              width: imageWidth,
              height: imageHeight,
              backgroundColor: colors.surface,
            }}
            resize={1200}
            resizeMode="cover"
            fadeDuration={250}
          />
          <View className="absolute bottom-0 left-0 right-0 px-5 pt-10 pb-5 bg-black/35">
            <Text className="text-base text-white text-center font-medium">
              {status.caption}
            </Text>
          </View>
          <Pressable
            onPress={onPrevious}
            className="absolute left-0 top-0 bottom-0 w-1/3"
          />
          <Pressable
            onPress={onNext}
            className="absolute right-0 top-0 bottom-0 w-1/3"
          />
        </View>
      </View>

      <View className="flex-row items-center gap-2.5 px-5 pt-3">
        <View
          className="flex-1 h-11 rounded-full border px-4 justify-center"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }}
        >
          <Text className="text-sm" style={{ color: colors.textMuted }}>
            Reply
          </Text>
        </View>
        <Pressable
          className="w-11 h-11 rounded-full items-center justify-center active:opacity-70"
          style={{ backgroundColor: colors.surface }}
          onPress={() =>
            toast.info('Status reaction', {
              description: 'React to this status',
            })
          }
        >
          <Text className="text-lg" style={{ color: colors.text }}>
            ☺
          </Text>
        </Pressable>
        <Pressable
          className="w-11 h-11 rounded-full items-center justify-center active:opacity-70"
          style={{ backgroundColor: colors.surface }}
          onPress={() =>
            toast.info('Status attachment', {
              description: 'Attach a photo or video',
            })
          }
        >
          <Plus size={22} color={colors.text} strokeWidth={1.75} />
        </Pressable>
        <Pressable
          className="w-11 h-11 rounded-full items-center justify-center active:opacity-70"
          style={{ backgroundColor: colors.primary }}
          onPress={() => toast.success('Reply sent')}
        >
          <SendHorizontal
            size={18}
            color={colors.background}
            strokeWidth={2.2}
          />
        </Pressable>
      </View>
    </Screen>
  )
}

export function StatusScreen() {
  const [selectedStatus, setSelectedStatus] = useState<SelectedStatus | null>(
    null,
  )
  const [isViewerVisible, setViewerVisible] = useState(false)
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteUsers()

  const users = useMemo(
    () => data?.pages.flatMap((page) => page.results) ?? [],
    [data],
  )
  const contacts = useMemo(() => createStatusContacts(users), [users])

  const openStatus = (contact: StatusContact) => {
    setSelectedStatus({ contact, index: 0 })
    setViewerVisible(true)
  }

  const closeViewer = () => {
    setViewerVisible(false)
  }

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  const goPrevious = () => {
    setSelectedStatus((current) => {
      if (!current) return current
      return {
        ...current,
        index: Math.max(0, current.index - 1),
      }
    })
  }

  const goNext = () => {
    if (!selectedStatus) return
    const lastIndex = selectedStatus.contact.statuses.length - 1
    if (selectedStatus.index >= lastIndex) {
      closeViewer()
      return
    }
    setSelectedStatus({
      ...selectedStatus,
      index: selectedStatus.index + 1,
    })
  }

  return (
    <View className="flex-1">
      <StatusList
        contacts={contacts}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        onEndReached={loadMore}
        onSelect={openStatus}
      />
      <Modal
        visible={isViewerVisible}
        animationType="fade"
        presentationStyle="fullScreen"
        statusBarTranslucent
        onRequestClose={closeViewer}
        onDismiss={() => setSelectedStatus(null)}
      >
        {selectedStatus ? (
          <StatusViewer
            selected={selectedStatus}
            onClose={closeViewer}
            onPrevious={goPrevious}
            onNext={goNext}
          />
        ) : null}
        <Toaster />
      </Modal>
    </View>
  )
}
