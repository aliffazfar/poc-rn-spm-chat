import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import TurboImage from 'react-native-turbo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  ChevronLeft,
  Search,
  EllipsisVertical,
  Plus,
  Smile,
  SendHorizontal,
  Play,
} from '@/components/icons';

export function ConversationScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [inputText, setInputText] = useState('Btw how abou');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-white"
    >
      <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-3 py-2 border-b border-neutral-100">
          <View className="flex-row items-center flex-1">
            <Pressable
              onPress={() => navigation.goBack()}
              hitSlop={10}
              className="p-1 active:opacity-60"
            >
              <ChevronLeft size={28} color="#171717" strokeWidth={2} />
            </Pressable>
            <Pressable
              onPress={() => navigation.navigate('ContactInfo')}
              className="flex-row items-center flex-1 ml-1 active:opacity-75"
            >
              <TurboImage
                source={{
                  uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                }}
                style={{ width: 40, height: 40, backgroundColor: '#E5E5E5' }}
                resize={150}
                resizeMode="cover"
                rounded
                fadeDuration={0}
              />
              <View className="ml-3">
                <Text className="text-base font-bold text-neutral-900">
                  Devon Robinson
                </Text>
                <Text className="text-xs text-neutral-400 font-medium">
                  Online
                </Text>
              </View>
            </Pressable>
          </View>

          <View className="flex-row items-center gap-4 pr-2">
            <Pressable hitSlop={10} className="active:opacity-60">
              <Search size={22} color="#171717" strokeWidth={1.75} />
            </Pressable>
            <Pressable hitSlop={10} className="active:opacity-60">
              <EllipsisVertical size={22} color="#171717" strokeWidth={1.75} />
            </Pressable>
          </View>
        </View>

        {/* Message Thread */}
        <ScrollView
          className="flex-1 px-4 pt-4"
          contentContainerClassName="pb-6"
          showsVerticalScrollIndicator={false}
        >
          {/* Incoming message */}
          <View className="flex-row justify-start mb-3">
            <View className="bg-neutral-100 rounded-3xl rounded-tl-sm px-4 py-3 max-w-[80%]">
              <Text className="text-base text-neutral-900 leading-snug">
                Hey, did you have breakfast yet?
              </Text>
              <Text className="text-[10px] text-neutral-400 text-right mt-1 font-medium">
                08:00
              </Text>
            </View>
          </View>

          {/* Outgoing message */}
          <View className="flex-row justify-end mb-3">
            <View className="bg-neutral-900 rounded-3xl rounded-tr-sm px-4 py-3 max-w-[80%]">
              <Text className="text-base text-white leading-snug">
                Not yet, I was in a rush finishing the design.
              </Text>
              <Text className="text-[10px] text-neutral-400 text-right mt-1 font-medium">
                08:00
              </Text>
            </View>
          </View>

          {/* Outgoing Image */}
          <View className="flex-row justify-end mb-3">
            <View className="bg-neutral-900 rounded-3xl rounded-tr-sm p-1.5 max-w-[82%]">
              <TurboImage
                source={{
                  uri: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80',
                }}
                style={{ width: 256, height: 160, borderRadius: 16, backgroundColor: '#262626' }}
                resize={600}
                resizeMode="cover"
                fadeDuration={0}
              />
              <Text className="text-[10px] text-neutral-400 text-right px-2 py-1 font-medium">
                08:00
              </Text>
            </View>
          </View>

          {/* Incoming message */}
          <View className="flex-row justify-start mb-3">
            <View className="bg-neutral-100 rounded-3xl rounded-tl-sm px-4 py-3 max-w-[80%]">
              <Text className="text-base text-neutral-900 leading-snug">
                Wow, that design looks amazing!
              </Text>
              <Text className="text-[10px] text-neutral-400 text-right mt-1 font-medium">
                08:00
              </Text>
            </View>
          </View>

          {/* Incoming Audio / Voice Message */}
          <View className="flex-row justify-start mb-3">
            <View className="bg-neutral-100 rounded-3xl rounded-tl-sm px-4 py-3 w-72">
              <View className="flex-row items-center gap-3">
                <View className="w-8 h-8 rounded-full bg-neutral-900 items-center justify-center">
                  <Play size={14} color="#FFFFFF" fill="#FFFFFF" />
                </View>
                {/* Waveform representation */}
                <View className="flex-1 flex-row items-center gap-0.5 h-6">
                  {[6, 12, 18, 10, 22, 14, 8, 16, 20, 10, 14, 8, 18, 12, 6, 10, 14, 8].map((h, i) => (
                    <View
                      key={i}
                      className={`w-1 rounded-full ${i < 6 ? 'bg-neutral-900' : 'bg-neutral-300'}`}
                      style={{ height: h }}
                    />
                  ))}
                </View>
                <Text className="text-xs font-semibold text-neutral-700">0.13</Text>
              </View>
              <Text className="text-[10px] text-neutral-400 text-right mt-1 font-medium">
                08:00
              </Text>
            </View>
          </View>

          {/* Outgoing Quoted Reply */}
          <View className="flex-row justify-end mb-2">
            <View className="items-end max-w-[80%]">
              <View className="border border-neutral-300 rounded-2xl px-3 py-1.5 mb-1 bg-white">
                <Text className="text-xs text-neutral-500">
                  Wow, that design looks amazing!
                </Text>
              </View>
              <View className="bg-neutral-900 rounded-3xl rounded-tr-sm px-4 py-2.5">
                <View className="flex-row items-baseline gap-2">
                  <Text className="text-base text-white">
                    Thanks a lot Devon!
                  </Text>
                  <Text className="text-[10px] text-neutral-400 font-medium">
                    08:00
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Input Bar */}
        <View
          className="flex-row items-center px-4 py-2 bg-white border-t border-neutral-100 gap-2.5"
          style={{ paddingBottom: Math.max(insets.bottom, 12) }}
        >
          <Pressable hitSlop={8} className="p-1 active:opacity-60">
            <Plus size={26} color="#737373" strokeWidth={2} />
          </Pressable>

          <View className="flex-1 flex-row items-center bg-neutral-100 rounded-full px-4 py-2">
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              className="flex-1 text-base text-neutral-900 p-0"
              placeholder="Message..."
              placeholderTextColorClassName="accent-neutral-400"
            />
            <Pressable hitSlop={6} className="ml-2 active:opacity-60">
              <Smile size={22} color="#737373" strokeWidth={1.75} />
            </Pressable>
          </View>

          <Pressable className="w-11 h-11 rounded-full bg-neutral-900 items-center justify-center active:opacity-80">
            <SendHorizontal size={18} color="#FFFFFF" strokeWidth={2.2} />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
