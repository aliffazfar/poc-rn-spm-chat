import React, { useState } from 'react'
import { View, Text, Pressable, TextInput, ScrollView } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { ActionSheet, Avatar } from '@/components'
import {
  Search,
  Instagram,
  XIcon,
  Mail,
  LinkIcon,
  Camera,
  QrCode,
  Sun,
  Moon,
  SlidersHorizontal,
} from '@/components/icons'
import { toast } from '@/components/molecules/Toaster'
import { useAppTheme } from '@/hooks'
import { ThemeMode } from '@/theme'
import { CURRENT_USER } from './mock'

export interface ProfileItem {
  label: string
  value: string
  hint?: string
}

export interface ProfileSheetProps {
  visible?: boolean
  onClose?: () => void
  type?: 'details' | 'invite' | 'theme' | 'qr'
  title?: string
  subtitle?: string
  items?: ProfileItem[]
  actionLabel?: string
  showProfileHeader?: boolean
}

interface ContactItem {
  id: string
  name: string
  phone: string
  avatar: string
  invited: boolean
}

const INITIAL_CONTACTS: ContactItem[] = [
  {
    id: '1',
    name: 'Michael Carter',
    phone: '+62 811-55667-8899',
    avatar:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    invited: true,
  },
  {
    id: '2',
    name: 'Clara',
    phone: '+62 818-88990-1122',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    invited: false,
  },
  {
    id: '3',
    name: 'Dimas Wijaya',
    phone: '+62 823-33445-6677',
    avatar:
      'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
    invited: false,
  },
  {
    id: '4',
    name: 'Emily Watson',
    phone: '+62 817-22334-5566',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop&q=80',
    invited: false,
  },
  {
    id: '5',
    name: 'John Lee',
    phone: '+62 123-45678-2211',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    invited: false,
  },
]

const THEME_OPTIONS: Array<{
  mode: ThemeMode
  label: string
}> = [
  {
    mode: 'system',
    label: 'System',
  },
  {
    mode: 'light',
    label: 'Light',
  },
  {
    mode: 'dark',
    label: 'Dark',
  },
]

export function ProfileSheet(props: ProfileSheetProps) {
  let routeParams: ProfileSheetProps = {}
  try {
    const route = useRoute<any>()
    routeParams = route?.params ?? {}
  } catch {
    // rendered directly as a sheet component
  }

  const { mode, colors, setMode } = useAppTheme()
  const isVisible = props.visible ?? true
  const onClose = props.onClose ?? (() => {})

  const type = props.type ?? routeParams.type ?? 'details'
  const title =
    props.title ??
    routeParams.title ??
    (type === 'invite'
      ? 'Invite to PerfChat'
      : type === 'theme'
        ? 'Appearance'
        : type === 'qr'
          ? 'My QR Code'
          : 'General Profile')
  const subtitle =
    props.subtitle ??
    routeParams.subtitle ??
    (type === 'theme' ? 'Choose how PerfChat looks on this device' : undefined)
  const items = props.items ??
    routeParams.items ?? [
      {
        label: 'Display Name',
        value: CURRENT_USER.name,
      },
      { label: 'Username', value: CURRENT_USER.username },
      { label: 'Status', value: CURRENT_USER.status },
      { label: 'Phone', value: CURRENT_USER.phone },
      { label: 'Email', value: CURRENT_USER.email },
    ]
  const actionLabel = props.actionLabel ?? routeParams.actionLabel ?? 'Done'
  const showProfileHeader =
    props.showProfileHeader ?? routeParams.showProfileHeader ?? false

  const [search, setSearch] = useState('')
  const [contacts, setContacts] = useState(INITIAL_CONTACTS)

  const toggleInvite = (id: string, name: string) => {
    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const next = !c.invited
          if (next) {
            toast.success(`Invite sent to ${name}`)
          }
          return { ...c, invited: next }
        }
        return c
      }),
    )
  }

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  )

  const handleAction = () => {
    if (type === 'qr') {
      toast.success('QR Code link copied to clipboard')
      onClose()
    } else if (type === 'details') {
      toast.success(
        actionLabel === 'Done' ? 'Settings saved' : `${actionLabel} completed`,
      )
      onClose()
    } else {
      onClose()
    }
  }

  return (
    <ActionSheet
      visible={isVisible}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="max-h-[460px]"
        contentContainerStyle={{ paddingBottom: 8 }}
      >
        {/* QR CODE MODE */}
        {type === 'qr' && (
          <View className="items-center py-2">
            {/* Crisp QR Code Container */}
            <View className="p-6 bg-white rounded-3xl border border-neutral-200/80 shadow-sm items-center justify-center mb-4">
              <View className="w-48 h-48 items-center justify-center relative">
                <View className="absolute inset-0 items-center justify-center">
                  <QrCode size={180} color="#171717" strokeWidth={2.4} />
                </View>
                <View className="p-1.5 bg-white rounded-full shadow-sm">
                  <Avatar
                    uri={CURRENT_USER.avatar}
                    name={CURRENT_USER.name}
                    size={42}
                  />
                </View>
              </View>
            </View>

            <Text className="text-lg font-bold text-neutral-900 dark:text-white">
              {CURRENT_USER.name}
            </Text>
            <Text className="text-xs font-medium text-neutral-400 dark:text-neutral-500 mt-0.5 mb-2">
              {CURRENT_USER.username}
            </Text>

            <Text className="text-xs text-neutral-400 dark:text-neutral-500 text-center px-6 mb-3 leading-4">
              Your QR code is private. When you share it, others can scan it to
              immediately message you on PerfChat.
            </Text>
          </View>
        )}

        {/* THEME MODE */}
        {type === 'theme' && (
          <View className="py-2">
            {/* 3-Card Segmented Selector */}
            <View className="flex-row gap-3 mb-4">
              {THEME_OPTIONS.map((opt) => {
                const isSelected = mode === opt.mode
                const IconComp =
                  opt.mode === 'system'
                    ? SlidersHorizontal
                    : opt.mode === 'light'
                      ? Sun
                      : Moon

                return (
                  <Pressable
                    key={opt.mode}
                    onPress={() => {
                      setMode(opt.mode)
                      toast.info(`Theme set to ${opt.label}`)
                    }}
                    className={`flex-1 items-center py-4 px-2 rounded-2xl border ${
                      isSelected
                        ? 'border-neutral-900 dark:border-white bg-neutral-100/90 dark:bg-neutral-800'
                        : 'border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/40 dark:bg-neutral-900/40 active:bg-neutral-100 dark:active:bg-neutral-800/50'
                    }`}
                  >
                    <View
                      className={`w-10 h-10 rounded-full items-center justify-center mb-2.5 ${
                        isSelected
                          ? 'bg-neutral-900 dark:bg-white'
                          : 'bg-neutral-200/60 dark:bg-neutral-800'
                      }`}
                    >
                      <IconComp
                        size={18}
                        color={
                          isSelected
                            ? mode === 'dark'
                              ? '#171717'
                              : '#FFFFFF'
                            : colors.text
                        }
                        strokeWidth={2}
                      />
                    </View>
                    <Text
                      className={`text-[13px] font-semibold text-center ${
                        isSelected
                          ? 'text-neutral-900 dark:text-white'
                          : 'text-neutral-600 dark:text-neutral-400'
                      }`}
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                )
              })}
            </View>

            {/* Theme summary */}
            <View className="p-3.5 rounded-2xl bg-neutral-50/60 dark:bg-neutral-900/50 border border-neutral-200/60 dark:border-neutral-800/80 mb-2">
              <Text className="text-xs text-neutral-500 dark:text-neutral-400 text-center leading-4">
                {mode === 'system'
                  ? 'PerfChat matches your device system appearance automatically.'
                  : mode === 'light'
                    ? 'Light appearance is active across all screens.'
                    : 'Dark appearance is active with high-contrast pure blacks.'}
              </Text>
            </View>
          </View>
        )}

        {/* DETAILS MODE */}
        {type === 'details' && (
          <View className="py-1">
            {showProfileHeader && (
              <View className="items-center mb-5 mt-1">
                <View className="relative">
                  <Avatar
                    uri={CURRENT_USER.avatar}
                    name={CURRENT_USER.name}
                    size={72}
                    isOnline
                  />
                  <Pressable
                    onPress={() =>
                      toast.info('Change Photo', {
                        description: 'Opening photo library...',
                      })
                    }
                    className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-neutral-900 dark:bg-white items-center justify-center border-2 border-white dark:border-[#1E1E1E] active:opacity-75"
                  >
                    <Camera
                      size={12}
                      color={mode === 'dark' ? '#171717' : '#FFFFFF'}
                      strokeWidth={2.2}
                    />
                  </Pressable>
                </View>
                <Text className="text-lg font-bold text-neutral-900 dark:text-white mt-2.5">
                  {CURRENT_USER.name}
                </Text>
                <Text className="text-xs font-medium text-neutral-400 dark:text-neutral-500">
                  {CURRENT_USER.username}
                </Text>
              </View>
            )}

            {/* Inset Grouped Card */}
            <View className="border border-neutral-200/80 dark:border-neutral-800 rounded-2xl bg-neutral-50/50 dark:bg-neutral-900/40 divide-y divide-neutral-200/60 dark:divide-neutral-800/80 mb-3 overflow-hidden">
              {items.map((item, idx) => (
                <View
                  key={idx}
                  className="flex-row items-center justify-between px-4 py-3.5"
                >
                  <View className="flex-1 mr-3">
                    <Text className="text-sm font-medium text-neutral-400 dark:text-neutral-500">
                      {item.label}
                    </Text>
                    {item.hint && (
                      <Text className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-0.5">
                        {item.hint}
                      </Text>
                    )}
                  </View>
                  <Text
                    className="text-sm font-semibold text-neutral-900 dark:text-white text-right max-w-[65%]"
                    numberOfLines={1}
                  >
                    {item.value}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* INVITE MODE */}
        {type === 'invite' && (
          <View className="py-1">
            {/* Search */}
            <View className="flex-row items-center bg-neutral-100 dark:bg-neutral-800 rounded-2xl px-3.5 py-2.5 mb-4">
              <Search size={18} color={colors.textMuted} strokeWidth={2} />
              <TextInput
                placeholder="Search"
                placeholderTextColor={colors.textMuted}
                value={search}
                onChangeText={setSearch}
                className="ml-2.5 flex-1 text-sm text-neutral-900 dark:text-white p-0"
              />
            </View>

            {/* Find friends on other apps - Clean Monochrome Card */}
            <Text className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2.5">
              Find friends on other apps
            </Text>
            <View className="bg-neutral-100 dark:bg-neutral-800/80 rounded-2xl py-3 px-2 flex-row items-center justify-around mb-5">
              <Pressable
                onPress={() =>
                  toast.success('Invite link copied for Instagram')
                }
                className="items-center active:opacity-60"
              >
                <Instagram size={22} color={colors.text} strokeWidth={1.75} />
                <Text className="text-xs font-medium text-neutral-700 dark:text-neutral-300 mt-2">
                  Instagram
                </Text>
              </Pressable>

              <Pressable
                onPress={() => toast.success('Invite link copied for X')}
                className="items-center active:opacity-60"
              >
                <XIcon size={20} color={colors.text} strokeWidth={1.75} />
                <Text className="text-xs font-medium text-neutral-700 dark:text-neutral-300 mt-2">
                  X
                </Text>
              </Pressable>

              <Pressable
                onPress={() => toast.success('Invite link copied for Email')}
                className="items-center active:opacity-60"
              >
                <Mail size={22} color={colors.text} strokeWidth={1.75} />
                <Text className="text-xs font-medium text-neutral-700 dark:text-neutral-300 mt-2">
                  Email
                </Text>
              </Pressable>

              <Pressable
                onPress={() => toast.success('Invite link copied')}
                className="items-center active:opacity-60"
              >
                <LinkIcon size={20} color={colors.text} strokeWidth={1.75} />
                <Text className="text-xs font-medium text-neutral-700 dark:text-neutral-300 mt-2">
                  Copy Link
                </Text>
              </Pressable>
            </View>

            {/* Invite from contacts */}
            <Text className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2">
              Invite from contacts
            </Text>

            <View className="gap-2.5 mb-2">
              {filteredContacts.map((contact) => (
                <View
                  key={contact.id}
                  className="flex-row items-center justify-between py-1.5"
                >
                  <View className="flex-row items-center flex-1 mr-3">
                    <Avatar
                      uri={contact.avatar}
                      name={contact.name}
                      size={42}
                    />
                    <View className="ml-3 flex-1">
                      <Text className="text-[15px] font-semibold text-neutral-900 dark:text-white">
                        {contact.name}
                      </Text>
                      <Text className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
                        {contact.phone}
                      </Text>
                    </View>
                  </View>

                  <Pressable
                    onPress={() => toggleInvite(contact.id, contact.name)}
                    className={`px-4 py-1.5 rounded-full active:opacity-75 ${
                      contact.invited
                        ? 'bg-neutral-100 dark:bg-neutral-800'
                        : 'bg-neutral-900 dark:bg-white'
                    }`}
                  >
                    <Text
                      className={`text-xs font-semibold ${
                        contact.invited
                          ? 'text-neutral-400 dark:text-neutral-500'
                          : 'text-white dark:text-neutral-900'
                      }`}
                    >
                      {contact.invited ? 'Invited' : 'Invite'}
                    </Text>
                  </Pressable>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Sticky Bottom Action Button */}
      <View className="pt-2 pb-1 bg-white dark:bg-[#1E1E1E]">
        <Pressable
          onPress={handleAction}
          className={`w-full py-3.5 rounded-2xl items-center justify-center active:opacity-80 ${
            actionLabel === 'Done'
              ? 'bg-neutral-100 dark:bg-neutral-800'
              : 'bg-neutral-900 dark:bg-white'
          }`}
        >
          <Text
            className={`text-base font-semibold ${
              actionLabel === 'Done'
                ? 'text-neutral-700 dark:text-neutral-200'
                : 'text-white dark:text-neutral-900'
            }`}
          >
            {actionLabel}
          </Text>
        </Pressable>
      </View>
    </ActionSheet>
  )
}
