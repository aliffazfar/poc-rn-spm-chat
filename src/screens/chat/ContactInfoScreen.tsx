import React, { useState } from 'react'
import { View, Text, Pressable, Switch } from 'react-native'
import TurboImage from 'react-native-turbo-image'
import {
  Screen,
  Avatar,
  ActionSheet,
  imagePreview,
  toast,
  SCREEN_HORIZONTAL_PADDING,
} from '@/components'
import { useNavigation, useRoute } from '@react-navigation/native'
import { LegendList } from '@legendapp/list/react-native'
import {
  ChevronLeft,
  ChevronRight,
  Phone,
  Video,
  Search,
  Bell,
  ImageIcon,
  Star,
  Lock,
  Flag,
  CircleSlash,
  IconProps,
} from '@/components/icons'
import { useAppTheme } from '@/hooks'
import { useUser } from '@/api'
import { useChatStore } from '@/store'
import { MEDIA_ITEMS, MediaItem } from './mock'

interface ContactMenuItem {
  id: string
  title: string
  subtitle?: string
  icon: React.ComponentType<IconProps>
  iconColor?: string
  textColor?: string
  rightBadge?: string | number
  isSwitch?: boolean
  hasTopDivider?: boolean
  onPress?: () => void
}

export function ContactInfoScreen() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const { colors } = useAppTheme()

  const chatId = route.params?.chatId ?? 1
  const chatIdNum = Number(chatId)
  const { data: user } = useUser(chatIdNum)

  const name = user?.name ?? 'Contact'
  const phone = user?.phone ?? '+62 123-45678-2211'
  const avatar = user?.avatar

  const [isLocked, setIsLocked] = useState(false)
  const [actionType, setActionType] = useState<'block' | 'report' | null>(null)

  const blockedUserIds = useChatStore((s) => s.blockedUserIds ?? [])
  const blockUser = useChatStore((s) => s.blockUser)
  const unblockUser = useChatStore((s) => s.unblockUser)
  const isBlocked = blockedUserIds.includes(chatIdNum)

  const menuItems: ContactMenuItem[] = [
    {
      id: 'notification',
      title: 'Notification',
      icon: Bell,
      onPress: () =>
        toast.info('Notification settings', {
          description: `Manage alerts for ${name}`,
        }),
    },
    {
      id: 'media_visibility',
      title: 'Media Visibility',
      icon: ImageIcon,
      onPress: () =>
        toast.info('Media visibility', {
          description: 'Save incoming media to camera roll',
        }),
    },
    {
      id: 'starred',
      title: 'Starred Messages',
      icon: Star,
      rightBadge: 19,
      onPress: () =>
        toast.info('Starred messages', {
          description: '19 messages saved',
        }),
    },
    {
      id: 'lock',
      title: 'Lock Message',
      subtitle: 'Show unread messages',
      icon: Lock,
      isSwitch: true,
    },
    {
      id: 'report',
      title: `Report ${name}`,
      icon: Flag,
      iconColor: colors.danger,
      textColor: 'text-red-500',
      hasTopDivider: true,
      onPress: () => setActionType('report'),
    },
    {
      id: 'block',
      title: isBlocked ? `Unblock ${name}` : `Block ${name}`,
      icon: CircleSlash,
      iconColor: isBlocked ? colors.text : colors.danger,
      textColor: isBlocked
        ? 'text-neutral-900 dark:text-white'
        : 'text-red-500',
      onPress: () => {
        if (isBlocked) {
          unblockUser(chatIdNum)
          toast.success(`${name} unblocked`)
        } else {
          setActionType('block')
        }
      },
    },
  ]

  const renderItem = ({ item }: { item: ContactMenuItem }) => {
    const IconComponent = item.icon
    const iconColor = item.iconColor ?? colors.text

    return (
      <View>
        {item.hasTopDivider && (
          <View className="border-t border-neutral-100 dark:border-neutral-800/60 my-2" />
        )}
        <Pressable
          onPress={item.onPress}
          className="flex-row items-center py-3.5 active:opacity-60"
        >
          <View className="w-6 items-center justify-center">
            <View
              style={item.id === 'report' ? { marginLeft: -2.5 } : undefined}
            >
              <IconComponent size={22} color={iconColor} strokeWidth={1.75} />
            </View>
          </View>
          <View className="ml-3.5 flex-1">
            <Text
              className={`text-[15px] font-semibold ${
                item.textColor ?? 'text-neutral-900 dark:text-white'
              }`}
            >
              {item.title}
            </Text>
            {item.subtitle && (
              <Text className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5 font-normal">
                {item.subtitle}
              </Text>
            )}
          </View>

          {item.rightBadge && (
            <Text className="text-sm font-medium text-neutral-400 dark:text-neutral-500">
              {item.rightBadge}
            </Text>
          )}

          {item.isSwitch && (
            <Switch
              value={isLocked}
              onValueChange={(val) => {
                setIsLocked(val)
                toast.info(val ? 'Chat locked' : 'Chat unlocked')
              }}
              trackColor={{
                false: colors.surfaceVariant,
                true: colors.primary,
              }}
              thumbColor={colors.background}
            />
          )}
        </Pressable>
      </View>
    )
  }

  return (
    <Screen edges={['top']} className="flex-1">
      {/* Header */}
      <View className="flex-row items-center px-5 pt-2 pb-2">
        <Pressable
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 items-center justify-center active:opacity-60"
        >
          <ChevronLeft size={22} color={colors.text} strokeWidth={2} />
        </Pressable>
        <Text className="text-xl font-bold text-neutral-900 dark:text-white ml-4">
          Contact Information
        </Text>
      </View>

      <LegendList
        data={menuItems}
        keyExtractor={(item: ContactMenuItem) => item.id}
        renderItem={renderItem}
        recycleItems
        estimatedItemSize={56}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: SCREEN_HORIZONTAL_PADDING,
          paddingBottom: 40,
        }}
        className="flex-1"
        ListHeaderComponent={
          <View className="mb-2">
            {/* Profile Avatar, Name, Phone */}
            <View className="items-center mt-3 mb-5">
              <Pressable
                onPress={() => {
                  if (avatar) {
                    imagePreview.open({
                      uri: avatar,
                      title: name,
                    })
                  }
                }}
                className="active:opacity-80"
              >
                <Avatar uri={avatar} name={name} size={84} isOnline />
              </Pressable>
              <Text className="text-xl font-bold text-neutral-900 dark:text-white mt-3">
                {name}
              </Text>
              <Text className="text-sm font-medium text-neutral-400 dark:text-neutral-500 mt-0.5">
                {phone}
              </Text>

              {/* Quick Action 3-Cards */}
              <View className="flex-row gap-3 mt-5 w-full">
                <Pressable
                  onPress={() =>
                    toast.info('Voice call', {
                      description: `Calling ${phone}...`,
                    })
                  }
                  className="flex-1 py-3 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl items-center justify-center active:bg-neutral-50 dark:active:bg-neutral-800/40"
                >
                  <Phone size={20} color={colors.text} strokeWidth={1.75} />
                  <Text className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 mt-1.5">
                    Voice Call
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() =>
                    toast.info('Video call', {
                      description: `Starting video call with ${name}...`,
                    })
                  }
                  className="flex-1 py-3 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl items-center justify-center active:bg-neutral-50 dark:active:bg-neutral-800/40"
                >
                  <Video size={20} color={colors.text} strokeWidth={1.75} />
                  <Text className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 mt-1.5">
                    Video Call
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() =>
                    toast.info('Search chat', {
                      description: `Searching messages with ${name}`,
                    })
                  }
                  className="flex-1 py-3 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl items-center justify-center active:bg-neutral-50 dark:active:bg-neutral-800/40"
                >
                  <Search size={20} color={colors.text} strokeWidth={1.75} />
                  <Text className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 mt-1.5">
                    Search
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Media, Links, Docs Section */}
            <View className="pt-4 border-t border-neutral-100 dark:border-neutral-800/60 mb-2">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                  Media, Links, Docs
                </Text>
                <Pressable
                  onPress={() =>
                    imagePreview.open({
                      images: MEDIA_ITEMS,
                      initialIndex: 0,
                      title: `${name}'s Media`,
                    })
                  }
                  className="flex-row items-center gap-1 active:opacity-60"
                >
                  <Text className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                    275
                  </Text>
                  <ChevronRight
                    size={16}
                    color={colors.chevron}
                    strokeWidth={2}
                  />
                </Pressable>
              </View>

              <LegendList
                horizontal
                data={MEDIA_ITEMS}
                keyExtractor={(_item, idx) => String(idx)}
                estimatedItemSize={94}
                getFixedItemSize={() => 94}
                recycleItems
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingRight: SCREEN_HORIZONTAL_PADDING,
                }}
                renderItem={({
                  item,
                  index,
                }: {
                  item: MediaItem
                  index: number
                }) => (
                  <Pressable
                    onPress={() =>
                      imagePreview.open({
                        images: MEDIA_ITEMS,
                        initialIndex: index,
                        title: `${name}'s Media`,
                      })
                    }
                    className="active:opacity-90"
                  >
                    <TurboImage
                      source={{ uri: item.uri }}
                      placeholder={{ blurhash: item.blurhash }}
                      style={{
                        width: 84,
                        height: 84,
                        marginRight: 10,
                        borderRadius: 16,
                        backgroundColor: colors.surface,
                      }}
                      resize={300}
                      resizeMode="cover"
                      fadeDuration={250}
                    />
                  </Pressable>
                )}
              />
            </View>
          </View>
        }
      />

      <ActionSheet
        visible={actionType !== null}
        onClose={() => setActionType(null)}
        title={actionType === 'report' ? `Report ${name}?` : `Block ${name}?`}
        subtitle={
          actionType === 'report'
            ? 'The last 5 messages from this contact will be forwarded to PerfChat. This contact will not be notified.'
            : 'Blocked contacts will no longer be able to call you or send you messages.'
        }
      >
        <View className="gap-2.5 mt-4 mb-2">
          <Pressable
            onPress={() => {
              if (actionType === 'block') {
                blockUser(chatIdNum)
                toast.error(`${name} blocked`)
              } else if (actionType === 'report') {
                toast.success('Report submitted', {
                  description: 'Thank you for helping keep the community safe.',
                })
              }
              setActionType(null)
            }}
            className="w-full py-3.5 rounded-2xl bg-red-500 active:bg-red-600 items-center justify-center"
          >
            <Text className="text-base font-semibold text-white">
              {actionType === 'report' ? 'Report' : 'Block'}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActionType(null)}
            className="w-full py-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800 active:opacity-70 items-center justify-center"
          >
            <Text className="text-base font-semibold text-neutral-900 dark:text-white">
              Cancel
            </Text>
          </Pressable>
        </View>
      </ActionSheet>
    </Screen>
  )
}
