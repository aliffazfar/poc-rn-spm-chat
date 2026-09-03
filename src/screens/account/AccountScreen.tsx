import React, { useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import { LegendList } from '@legendapp/list/react-native'
import { Screen, Avatar, SCREEN_HORIZONTAL_PADDING } from '@/components'
import {
  Search,
  QrCode,
  PlusCircle,
  SlidersHorizontal,
  Bell,
  Globe,
  HelpCircle,
  UserPlus,
  ChevronRight,
  Moon,
  IconProps,
} from '@/components/icons'
import { useAppTheme } from '@/hooks'
import { ProfileSheet, ProfileSheetProps } from './ProfileSheet'
import { CURRENT_USER } from './mock'

const APP_VERSION = 'Version 1.0.0.3 (20250905)'

interface AccountMenuItem {
  id: string
  title: string
  subtitle?: string
  icon: React.ComponentType<IconProps>
  onPress?: () => void
  rightElement?: React.ReactNode
}

export function AccountScreen() {
  const { colors } = useAppTheme()
  const [sheetConfig, setSheetConfig] = useState<ProfileSheetProps | null>(null)

  const openProfileSheet = () =>
    setSheetConfig({
      type: 'details',
      title: 'My Profile',
      subtitle: CURRENT_USER.bio,
      showProfileHeader: true,
      items: [
        { label: 'Display Name', value: CURRENT_USER.name },
        { label: 'Username', value: CURRENT_USER.username },
        { label: 'Status', value: CURRENT_USER.status },
        { label: 'Phone', value: CURRENT_USER.phone },
        { label: 'Email', value: CURRENT_USER.email },
      ],
      actionLabel: 'Edit Profile',
    })

  const menuItems: AccountMenuItem[] = [
    {
      id: 'general',
      title: 'General',
      subtitle: 'Manage your profile',
      icon: SlidersHorizontal,
      onPress: openProfileSheet,
    },
    {
      id: 'appearance',
      title: 'Appearance',
      subtitle: 'Theme & dark mode',
      icon: Moon,
      onPress: () =>
        setSheetConfig({
          type: 'theme',
          title: 'Appearance',
          subtitle: 'Choose how PerfChat looks on this device',
        }),
    },
    {
      id: 'notifications',
      title: 'Notifications',
      subtitle: 'Message & call tones',
      icon: Bell,
      onPress: () =>
        setSheetConfig({
          type: 'details',
          title: 'Notifications',
          subtitle: 'Message & call tones, alerts and vibrations',
          items: [
            {
              label: 'Message Sounds',
              value: 'Note (Default)',
              hint: 'Play sound for incoming messages',
            },
            {
              label: 'Call Ringtone',
              value: 'Opening',
              hint: 'Ringtone for audio & video calls',
            },
            { label: 'Vibration', value: 'Default pattern' },
            { label: 'Show Previews', value: 'Always' },
          ],
          actionLabel: 'Reset Notification Settings',
        }),
    },
    {
      id: 'language',
      title: 'App Language',
      subtitle: 'English',
      icon: Globe,
      onPress: () =>
        setSheetConfig({
          type: 'details',
          title: 'App Language',
          subtitle: 'Choose your preferred display language',
          items: [
            {
              label: 'English (US)',
              value: 'Active',
              hint: 'System default language',
            },
            { label: 'Español', value: 'Available' },
            { label: 'Français', value: 'Available' },
            { label: 'Bahasa Melayu', value: 'Available' },
          ],
          actionLabel: 'Save Language',
        }),
    },
    {
      id: 'help',
      title: 'Help',
      subtitle: 'Help centre, contact us and policy',
      icon: HelpCircle,
      onPress: () =>
        setSheetConfig({
          type: 'details',
          title: 'Help & Support',
          subtitle: 'Help centre, contact us and policy',
          items: [
            {
              label: 'Help Centre',
              value: 'help.perfchat.dev',
              hint: 'Browse setup guides and FAQs',
            },
            { label: 'Contact Support', value: 'support@perfchat.dev' },
            { label: 'Terms of Service', value: 'v2025.1' },
            { label: 'Privacy Policy', value: 'End-to-end encrypted' },
          ],
          actionLabel: 'Contact Us',
        }),
    },
    {
      id: 'invite',
      title: 'Invite a Friend',
      icon: UserPlus,
      onPress: () =>
        setSheetConfig({
          type: 'invite',
          title: 'Invite to PerfChat',
          subtitle: 'Invite your friends from contacts or other apps',
          actionLabel: 'Done',
        }),
    },
  ]

  const renderItem = ({ item }: { item: AccountMenuItem }) => {
    const IconComponent = item.icon

    return (
      <Pressable
        onPress={item.onPress}
        className="flex-row items-center justify-between py-3.5 active:opacity-60"
      >
        <View className="flex-row items-center flex-1 mr-3">
          <View className="w-7 items-center justify-center">
            <IconComponent size={22} color={colors.text} strokeWidth={1.75} />
          </View>
          <View className="ml-4 flex-1">
            <Text className="text-base font-semibold text-neutral-900 dark:text-white">
              {item.title}
            </Text>
            {item.subtitle ? (
              <Text className="text-[13px] text-neutral-400 dark:text-neutral-500 mt-0.5 leading-4">
                {item.subtitle}
              </Text>
            ) : null}
          </View>
        </View>

        {item.rightElement ?? (
          <ChevronRight size={18} color={colors.chevron} strokeWidth={2} />
        )}
      </Pressable>
    )
  }

  return (
    <Screen edges={['top']} className="flex-1">
      <LegendList
        data={menuItems}
        keyExtractor={(item: AccountMenuItem) => item.id}
        renderItem={renderItem}
        recycleItems
        estimatedItemSize={60}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: SCREEN_HORIZONTAL_PADDING,
          paddingTop: 12,
          paddingBottom: 24,
        }}
        className="flex-1"
        ListHeaderComponent={
          <View className="mb-2">
            {/* Header */}
            <View className="flex-row items-center justify-between pt-2 pb-5">
              <Text className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Account
              </Text>
              <Pressable hitSlop={10} className="p-1 active:opacity-60">
                <Search size={22} color={colors.text} strokeWidth={2} />
              </Pressable>
            </View>

            {/* Profile Row */}
            <Pressable
              onPress={openProfileSheet}
              className="flex-row items-center justify-between pb-4 active:opacity-75"
            >
              <View className="flex-row items-center flex-1">
                <Avatar
                  uri={CURRENT_USER.avatar}
                  name={CURRENT_USER.name}
                  size={56}
                />
                <View className="ml-3.5 flex-1">
                  <Text
                    className="text-[17px] font-bold text-neutral-900 dark:text-white"
                    numberOfLines={1}
                  >
                    {CURRENT_USER.name}
                  </Text>
                  <Text className="text-sm font-medium text-neutral-400 dark:text-neutral-500 mt-0.5">
                    {CURRENT_USER.status}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center gap-4">
                <Pressable
                  hitSlop={8}
                  onPress={() =>
                    setSheetConfig({
                      type: 'qr',
                      title: 'My QR Code',
                      subtitle: `Scan this code to connect with ${CURRENT_USER.name}`,
                    })
                  }
                  className="p-1 active:opacity-60"
                >
                  <QrCode size={22} color={colors.text} strokeWidth={1.75} />
                </Pressable>
                <Pressable
                  hitSlop={8}
                  onPress={() =>
                    setSheetConfig({
                      type: 'invite',
                      title: 'Invite to PerfChat',
                      subtitle:
                        'Invite your friends from contacts or other apps',
                      actionLabel: 'Done',
                    })
                  }
                  className="p-1 active:opacity-60"
                >
                  <PlusCircle
                    size={22}
                    color={colors.text}
                    strokeWidth={1.75}
                  />
                </Pressable>
              </View>
            </Pressable>
          </View>
        }
        ListFooterComponent={
          <View className="pt-24 pb-8 items-center">
            <Text className="text-xs text-neutral-400 dark:text-neutral-500 font-medium tracking-wide">
              {APP_VERSION}
            </Text>
          </View>
        }
      />

      <ProfileSheet
        visible={!!sheetConfig}
        onClose={() => setSheetConfig(null)}
        {...sheetConfig}
      />
    </Screen>
  )
}
