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
  Check,
} from '@/components/icons'
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
  type?: 'details' | 'invite' | 'theme'
  title?: string
  subtitle?: string
  items?: ProfileItem[]
  actionLabel?: string
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
  description: string
}> = [
  {
    mode: 'system',
    label: 'System Default',
    description: 'Automatically match device appearance',
  },
  {
    mode: 'light',
    label: 'Light',
    description: 'Always use clean light theme',
  },
  {
    mode: 'dark',
    label: 'Dark',
    description: 'Always use high-contrast dark theme',
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
        hint: 'Visible to all contacts',
      },
      { label: 'Status', value: CURRENT_USER.status, hint: 'Updated today' },
      { label: 'Phone', value: CURRENT_USER.phone },
      { label: 'Email', value: CURRENT_USER.email },
    ]
  const actionLabel = props.actionLabel ?? routeParams.actionLabel ?? 'Done'

  const [search, setSearch] = useState('')
  const [contacts, setContacts] = useState(INITIAL_CONTACTS)

  const toggleInvite = (id: string) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, invited: !c.invited } : c)),
    )
  }

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <ActionSheet
      visible={isVisible}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="max-h-[500px]"
        contentContainerStyle={{ paddingBottom: 12 }}
      >
        {/* THEME MODE */}
        {type === 'theme' && (
          <View className="gap-2.5">
            {THEME_OPTIONS.map((opt) => {
              const isSelected = mode === opt.mode
              return (
                <Pressable
                  key={opt.mode}
                  onPress={() => {
                    setMode(opt.mode)
                    onClose()
                  }}
                  className={`flex-row items-center justify-between p-4 rounded-2xl active:opacity-70 ${
                    isSelected
                      ? 'bg-neutral-100 dark:bg-neutral-800'
                      : 'bg-transparent'
                  }`}
                >
                  <View>
                    <Text className="text-base font-semibold text-neutral-900 dark:text-white">
                      {opt.label}
                    </Text>
                    <Text className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
                      {opt.description}
                    </Text>
                  </View>

                  {isSelected && (
                    <Check size={20} color={colors.text} strokeWidth={2.5} />
                  )}
                </Pressable>
              )
            })}
          </View>
        )}

        {/* INVITE MODE */}
        {type === 'invite' && (
          <View>
            {/* Search */}
            <View className="flex-row items-center bg-neutral-100 dark:bg-neutral-800 rounded-2xl px-3.5 py-2.5 mb-4">
              <Search size={18} color={colors.textMuted} />
              <TextInput
                placeholder="Search"
                placeholderTextColor={colors.textMuted}
                value={search}
                onChangeText={setSearch}
                className="ml-2.5 flex-1 text-sm text-neutral-900 dark:text-white p-0"
              />
            </View>

            {/* Find friends on other apps */}
            <Text className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-3">
              Find friends on other apps
            </Text>
            <View className="bg-neutral-100 dark:bg-neutral-800/80 rounded-2xl p-4 mb-5 flex-row items-center justify-around">
              <Pressable className="items-center active:opacity-60">
                <View className="w-11 h-11 rounded-full bg-white dark:bg-neutral-700 items-center justify-center mb-1.5 shadow-sm">
                  <Instagram size={22} color={colors.text} strokeWidth={1.75} />
                </View>
                <Text className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Instagram
                </Text>
              </Pressable>

              <Pressable className="items-center active:opacity-60">
                <View className="w-11 h-11 rounded-full bg-white dark:bg-neutral-700 items-center justify-center mb-1.5 shadow-sm">
                  <XIcon size={20} color={colors.text} strokeWidth={1.75} />
                </View>
                <Text className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  X
                </Text>
              </Pressable>

              <Pressable className="items-center active:opacity-60">
                <View className="w-11 h-11 rounded-full bg-white dark:bg-neutral-700 items-center justify-center mb-1.5 shadow-sm">
                  <Mail size={22} color={colors.text} strokeWidth={1.75} />
                </View>
                <Text className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Email
                </Text>
              </Pressable>

              <Pressable className="items-center active:opacity-60">
                <View className="w-11 h-11 rounded-full bg-white dark:bg-neutral-700 items-center justify-center mb-1.5 shadow-sm">
                  <LinkIcon size={20} color={colors.text} strokeWidth={1.75} />
                </View>
                <Text className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Copy Link
                </Text>
              </Pressable>
            </View>

            {/* Invite from contacts */}
            <Text className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2">
              Invite from contacts
            </Text>

            <View className="gap-2.5">
              {filteredContacts.map((contact) => (
                <View
                  key={contact.id}
                  className="flex-row items-center justify-between py-1.5"
                >
                  <View className="flex-row items-center flex-1 mr-3">
                    <Avatar
                      uri={contact.avatar}
                      name={contact.name}
                      size={44}
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
                    onPress={() => toggleInvite(contact.id)}
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

        {/* DETAILS MODE */}
        {type === 'details' && (
          <View>
            <View className="bg-neutral-100 dark:bg-neutral-800/80 rounded-2xl p-2 mb-5 divide-y divide-neutral-200/60 dark:divide-neutral-700/60">
              {items.map((item, idx) => (
                <View
                  key={idx}
                  className="flex-row items-center justify-between p-3"
                >
                  <View className="flex-1 mr-3">
                    <Text className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-0.5">
                      {item.label}
                    </Text>
                    {item.hint && (
                      <Text className="text-[11px] text-neutral-400 dark:text-neutral-500">
                        {item.hint}
                      </Text>
                    )}
                  </View>
                  <Text className="text-sm font-semibold text-neutral-900 dark:text-white">
                    {item.value}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Button */}
      <Pressable
        onPress={onClose}
        className="w-full py-3.5 mt-2 rounded-2xl bg-neutral-900 dark:bg-white items-center justify-center active:opacity-80"
      >
        <Text className="text-base font-semibold text-white dark:text-neutral-900">
          {actionLabel}
        </Text>
      </Pressable>
    </ActionSheet>
  )
}
