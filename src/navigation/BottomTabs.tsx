import React from 'react';
import { type ColorValue, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ChatScreen } from '@/screens/ChatScreen';
import { StatusScreen } from '@/screens/StatusScreen';
import { CallsScreen } from '@/screens/CallsScreen';
import { AccountScreen } from '@/screens/AccountScreen';
import {
  MessageSquare,
  Radio,
  Phone,
  User,
} from '@/components/icons';

function TabIcon({
  Icon,
  focused,
  color,
  fill,
}: {
  Icon: any;
  focused: boolean;
  color: string;
  fill?: ColorValue;
}) {
  if (focused) {
    return (
      <View className="w-14 h-7 rounded-full bg-neutral-100 items-center justify-center">
        <Icon size={20} color="#171717" fill={fill} strokeWidth={2.2} />
      </View>
    );
  }
  return <Icon size={22} color={color} strokeWidth={1.75} />;
}

export const BottomTabs = createBottomTabNavigator({
  screenOptions: {
    headerShown: false,
    tabBarActiveTintColor: '#171717',
    tabBarInactiveTintColor: '#8E8E93',
    tabBarStyle: {
      backgroundColor: '#FFFFFF',
      borderTopColor: '#F3F4F6',
      borderTopWidth: 1,
      elevation: 0,
    },
    tabBarLabelStyle: {
      fontSize: 11,
      fontWeight: '600',
      marginTop: 2,
    },
  },
  screens: {
    Chats: {
      screen: ChatScreen,
      options: {
        title: 'Chats',
        tabBarIcon: ({ focused, color }) => (
          <TabIcon
            Icon={MessageSquare}
            focused={focused}
            color={color}
            fill={focused ? '#171717' : undefined}
          />
        ),
      },
    },
    Status: {
      screen: StatusScreen,
      options: {
        title: 'Status',
        tabBarIcon: ({ focused, color }) => (
          <TabIcon Icon={Radio} focused={focused} color={color} />
        ),
      },
    },
    Calls: {
      screen: CallsScreen,
      options: {
        title: 'Calls',
        tabBarIcon: ({ focused, color }) => (
          <TabIcon Icon={Phone} focused={focused} color={color} />
        ),
      },
    },
    Account: {
      screen: AccountScreen,
      options: {
        title: 'Account',
        tabBarIcon: ({ focused, color }) => (
          <TabIcon Icon={User} focused={focused} color={color} />
        ),
      },
    },
  },
});
