import React, { useState } from 'react'
import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { ChevronLeft, Search, EllipsisVertical } from '@/components/icons'
import {
  Screen,
  Avatar,
  MessageBubble,
  MessageInput,
  imagePreview,
  toast,
  SCREEN_HORIZONTAL_PADDING,
} from '@/components'
import { useComments, useSendComment, useUser } from '@/api'
import { useAppTheme } from '@/hooks'
import { useChatStore } from '@/store'
import { LegendList } from '@legendapp/list/react-native'

export function ConversationScreen() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const { colors } = useAppTheme()

  const chatId = route.params?.chatId ?? 1
  const chatIdNum = Number(chatId)
  const { data: user } = useUser(chatIdNum)

  const blockedUserIds = useChatStore((s) => s.blockedUserIds ?? [])
  const unblockUser = useChatStore((s) => s.unblockUser)
  const isBlocked = blockedUserIds.includes(chatIdNum)

  const name = user?.name ?? 'Contact'
  const avatar = user?.avatar

  const [inputText, setInputText] = useState('')
  const { data: comments, isLoading: isLoadingComments } =
    useComments(chatIdNum)
  const { mutate: sendMessage, isPending: isSending } =
    useSendComment(chatIdNum)

  const handleSend = () => {
    if (!inputText.trim() || isSending || isBlocked) return
    sendMessage(inputText.trim())
    setInputText('')
  }

  return (
    <Screen>
      <KeyboardAvoidingView behavior="height" className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-2 border-b border-neutral-100 dark:border-neutral-800">
          <View className="flex-row items-center flex-1">
            <Pressable
              onPress={() => navigation.goBack()}
              hitSlop={10}
              className="-ml-1 p-1 active:opacity-60"
            >
              <ChevronLeft size={28} color={colors.text} strokeWidth={2} />
            </Pressable>
            <Pressable
              onPress={() =>
                navigation.navigate('ContactInfo', {
                  chatId,
                })
              }
              className="flex-row items-center flex-1 ml-1 active:opacity-75"
            >
              <Avatar uri={avatar} name={name} size={40} isOnline />
              <View className="ml-3">
                <Text className="text-base font-bold text-neutral-900 dark:text-white">
                  {name}
                </Text>
                <Text className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">
                  Online
                </Text>
              </View>
            </Pressable>
          </View>

          <View className="flex-row items-center gap-4 -mr-1">
            <Pressable
              onPress={() =>
                toast.info('Search messages', {
                  description: `Searching chat with ${name}`,
                })
              }
              hitSlop={10}
              className="active:opacity-60"
            >
              <Search size={22} color={colors.text} strokeWidth={1.75} />
            </Pressable>
            <Pressable
              onPress={() =>
                toast.info('More options', {
                  description: 'Media, links, docs, wallpaper and more',
                })
              }
              hitSlop={10}
              className="active:opacity-60"
            >
              <EllipsisVertical
                size={22}
                color={colors.text}
                strokeWidth={1.75}
              />
            </Pressable>
          </View>
        </View>

        {/* Message Thread */}
        {isLoadingComments ? (
          <View className="flex-1 items-center justify-center py-10">
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : (
          <LegendList
            data={comments ?? []}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={({ item, index }) => (
              <MessageBubble
                key={`${item.id}-${index}`}
                text={item.body}
                imageUrl={item.imageUrl}
                blurhash={item.blurhash}
                audioDuration={item.audioDuration}
                isMe={item.isMe ?? index % 2 === 1}
                isSystem={item.isSystem}
                onPressImage={() => {
                  if (item.imageUrl) {
                    imagePreview.open({
                      uri: item.imageUrl,
                      blurhash: item.blurhash,
                      aspectRatio: 1.5,
                      title: name,
                    })
                  }
                }}
                onPressAudio={() =>
                  toast.info('Voice message', {
                    description: `Playing audio note (${item.audioDuration ?? '0:15'})`,
                  })
                }
                time={
                  item.createdAt
                    ? new Date(item.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '08:00'
                }
              />
            )}
            alignItemsAtEnd
            initialScrollAtEnd
            maintainScrollAtEnd
            maintainScrollAtEndThreshold={0.1}
            recycleItems
            estimatedItemSize={80}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: SCREEN_HORIZONTAL_PADDING,
              paddingTop: 16,
              paddingBottom: 4,
            }}
            className="flex-1"
            ListEmptyComponent={
              <View className="items-center justify-center py-12">
                <Text className="text-sm text-neutral-400 dark:text-neutral-500">
                  No messages yet. Say hello!
                </Text>
              </View>
            }
          />
        )}

        {/* Bottom Input Bar */}
        {isBlocked ? (
          <Pressable
            onPress={() => {
              unblockUser(chatIdNum)
              toast.success(`${name} unblocked`)
            }}
            className="py-4 px-5 items-center justify-center bg-neutral-100 dark:bg-[#1A1A1A] border-t border-neutral-200 dark:border-neutral-800 active:opacity-75"
          >
            <Text className="text-xs text-neutral-500 dark:text-neutral-400 font-medium text-center">
              You blocked this contact.{' '}
              <Text className="font-semibold text-neutral-900 dark:text-white underline">
                Tap to unblock.
              </Text>
            </Text>
          </Pressable>
        ) : (
          <MessageInput
            value={inputText}
            onChangeText={setInputText}
            onSend={handleSend}
            onPressPlus={() =>
              toast.info('Attachments', {
                description: 'Share photos, documents, location or contacts',
              })
            }
            onPressSmile={() =>
              toast.info('Stickers & Emojis', {
                description: 'Choose emoji reactions or sticker packs',
              })
            }
            isSending={isSending}
          />
        )}
      </KeyboardAvoidingView>
    </Screen>
  )
}
