import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, Search, EllipsisVertical } from '@/components/icons';
import { Avatar, MessageBubble, MessageInput } from '@/components';
import { useComments, useSendComment } from '@/api';
import { useUniwind } from 'uniwind';

export function ConversationScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { theme } = useUniwind();
  const isDark = theme === 'dark';

  const chatId = route.params?.chatId ?? 1;
  const name = route.params?.name ?? 'Devon Robinson';
  const avatar =
    route.params?.avatar ??
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

  const [inputText, setInputText] = useState('');
  const { data: comments, isLoading: isLoadingComments } = useComments(
    Number(chatId),
  );
  const { mutate: sendMessage, isPending: isSending } = useSendComment(
    Number(chatId),
  );

  const handleSend = () => {
    if (!inputText.trim() || isSending) return;
    sendMessage(inputText.trim());
    setInputText('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-white dark:bg-[#1E1E1E]"
    >
      <View
        className="flex-1 bg-white dark:bg-[#1E1E1E]"
        style={{ paddingTop: insets.top }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-3 py-2 border-b border-neutral-100 dark:border-neutral-800">
          <View className="flex-row items-center flex-1">
            <Pressable
              onPress={() => navigation.goBack()}
              hitSlop={10}
              className="p-1 active:opacity-60"
            >
              <ChevronLeft
                size={28}
                color={isDark ? '#FFFFFF' : '#171717'}
                strokeWidth={2}
              />
            </Pressable>
            <Pressable
              onPress={() => navigation.navigate('ContactInfo')}
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

          <View className="flex-row items-center gap-4 pr-2">
            <Pressable hitSlop={10} className="active:opacity-60">
              <Search
                size={22}
                color={isDark ? '#FFFFFF' : '#171717'}
                strokeWidth={1.75}
              />
            </Pressable>
            <Pressable hitSlop={10} className="active:opacity-60">
              <EllipsisVertical
                size={22}
                color={isDark ? '#FFFFFF' : '#171717'}
                strokeWidth={1.75}
              />
            </Pressable>
          </View>
        </View>

        {/* Message Thread */}
        <ScrollView
          className="flex-1 px-4 pt-4"
          contentContainerClassName="pb-6"
          showsVerticalScrollIndicator={false}
        >
          {isLoadingComments ? (
            <View className="items-center justify-center py-10">
              <ActivityIndicator
                size="small"
                color={isDark ? '#FFFFFF' : '#171717'}
              />
            </View>
          ) : comments && comments.length > 0 ? (
            comments.map((item, index) => (
              <MessageBubble
                key={item.id}
                text={item.body}
                isMe={index % 2 === 1}
                time={
                  item.createdAt
                    ? new Date(item.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '08:00'
                }
              />
            ))
          ) : (
            <View className="items-center justify-center py-12">
              <Text className="text-sm text-neutral-400">
                No messages yet. Say hello!
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Bottom Input Bar */}
        <MessageInput
          value={inputText}
          onChangeText={setInputText}
          onSend={handleSend}
          isSending={isSending}
          bottomInset={insets.bottom}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
