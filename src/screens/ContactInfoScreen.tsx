import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Switch,
} from 'react-native';
import TurboImage from 'react-native-turbo-image';
import { Avatar } from '@/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
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
} from '@/components/icons';

const MEDIA_THUMBNAILS = [
  'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1448375240586-882707db888b?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1511497584788-87676104235f?w=300&auto=format&fit=crop&q=80',
];

export function ContactInfoScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [isLocked, setIsLocked] = useState(false);

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-2">
        <Pressable
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full bg-neutral-100 items-center justify-center active:opacity-60"
        >
          <ChevronLeft size={22} color="#171717" strokeWidth={2} />
        </Pressable>
        <Text className="text-xl font-bold text-neutral-900 ml-4">
          Contact Information
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-12"
      >
        {/* Profile Card */}
        <View className="items-center mt-4 mb-6">
          <Avatar
            uri="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
            name="Jonathan"
            size={96}
            isOnline
          />
          <Text className="text-2xl font-bold text-neutral-900 mt-3">
            Jonathan
          </Text>
          <Text className="text-sm text-neutral-500 mt-1 font-medium">
            +62 123-45678-2211
          </Text>

          {/* Quick Actions (3 cards) */}
          <View className="flex-row gap-3 mt-5 px-4 w-full">
            <Pressable className="flex-1 py-3.5 border border-neutral-200 rounded-2xl items-center justify-center active:bg-neutral-50">
              <Phone size={20} color="#171717" strokeWidth={1.75} />
              <Text className="text-xs font-semibold text-neutral-800 mt-2">
                Voice Call
              </Text>
            </Pressable>

            <Pressable className="flex-1 py-3.5 border border-neutral-200 rounded-2xl items-center justify-center active:bg-neutral-50">
              <Video size={20} color="#171717" strokeWidth={1.75} />
              <Text className="text-xs font-semibold text-neutral-800 mt-2">
                Video Call
              </Text>
            </Pressable>

            <Pressable className="flex-1 py-3.5 border border-neutral-200 rounded-2xl items-center justify-center active:bg-neutral-50">
              <Search size={20} color="#171717" strokeWidth={1.75} />
              <Text className="text-xs font-semibold text-neutral-800 mt-2">
                Search
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Media, Links, Docs */}
        <View className="px-4 py-3 border-t border-neutral-100">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-base font-semibold text-neutral-800">
              Media, Links, Docs
            </Text>
            <View className="flex-row items-center gap-1">
              <Text className="text-sm font-semibold text-neutral-800">
                275
              </Text>
              <ChevronRight size={16} color="#171717" strokeWidth={2} />
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row gap-3"
          >
            {MEDIA_THUMBNAILS.map((uri, idx) => (
              <TurboImage
                key={idx}
                source={{ uri }}
                style={{
                  width: 96,
                  height: 96,
                  marginRight: 10,
                  borderRadius: 16,
                  backgroundColor: '#F5F5F5',
                }}
                resize={300}
                resizeMode="cover"
                fadeDuration={0}
              />
            ))}
          </ScrollView>
        </View>

        {/* Options List */}
        <View className="px-4 pt-2">
          {/* Notification */}
          <Pressable className="flex-row items-center py-4 active:bg-neutral-50">
            <Bell size={22} color="#171717" strokeWidth={1.75} />
            <Text className="text-base font-semibold text-neutral-800 ml-4 flex-1">
              Notification
            </Text>
          </Pressable>

          {/* Media Visibility */}
          <Pressable className="flex-row items-center py-4 active:bg-neutral-50">
            <ImageIcon size={22} color="#171717" strokeWidth={1.75} />
            <Text className="text-base font-semibold text-neutral-800 ml-4 flex-1">
              Media Visibility
            </Text>
          </Pressable>

          {/* Starred Messages */}
          <Pressable className="flex-row items-center py-4 active:bg-neutral-50">
            <Star size={22} color="#171717" strokeWidth={1.75} />
            <Text className="text-base font-semibold text-neutral-800 ml-4 flex-1">
              Starred Messages
            </Text>
            <Text className="text-sm font-medium text-neutral-400 mr-2">
              19
            </Text>
          </Pressable>

          {/* Lock Message */}
          <View className="flex-row items-center py-3">
            <Lock size={22} color="#171717" strokeWidth={1.75} />
            <View className="ml-4 flex-1">
              <Text className="text-base font-semibold text-neutral-800">
                Lock Message
              </Text>
              <Text className="text-xs text-neutral-400 mt-0.5">
                Show unread messages
              </Text>
            </View>
            <Switch
              value={isLocked}
              onValueChange={setIsLocked}
              trackColor={{ false: '#E5E5E5', true: '#171717' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Danger Options */}
        <View className="px-4 pt-4 mt-2 border-t border-neutral-100">
          <Pressable className="flex-row items-center py-3.5 active:opacity-60">
            <Flag size={20} color="#EF4444" strokeWidth={1.75} />
            <Text className="text-base font-semibold text-red-500 ml-4">
              Report Jonathan
            </Text>
          </Pressable>

          <Pressable className="flex-row items-center py-3.5 active:opacity-60">
            <CircleSlash size={20} color="#EF4444" strokeWidth={1.75} />
            <Text className="text-base font-semibold text-red-500 ml-4">
              Block Jonathan
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
