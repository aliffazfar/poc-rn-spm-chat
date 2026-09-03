import React from 'react'
import { type ColorValue, View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { ChatScreen } from '@/screens/chat'
import { StatusScreen } from '@/screens/status'
import { CallsScreen } from '@/screens/calls'
import { AccountScreen } from '@/screens/account'
import { MessageSquare, Radio, Phone, User } from '@/components/icons'

import { useAppTheme } from '@/hooks'

function TabIcon({
  Icon,
  focused,
  color,
  fill,
}: {
  Icon: any
  focused: boolean
  color: string
  fill?: ColorValue
}) {
  const { isDark } = useAppTheme()

  if (focused) {
    return (
      <View className="w-14 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 items-center justify-center">
        <Icon
          size={20}
          color={isDark ? '#FFFFFF' : '#171717'}
          fill={fill ?? (isDark ? '#FFFFFF' : '#171717')}
          strokeWidth={2.2}
        />
      </View>
    )
  }
  return <Icon size={22} color={color} strokeWidth={1.75} />
}

export const BottomTabs = createBottomTabNavigator({
  screenOptions: ({ theme }) => ({
    headerShown: false,
    tabBarActiveTintColor: theme.dark ? '#FFFFFF' : '#171717',
    tabBarInactiveTintColor: '#8E8E93',
    tabBarStyle: {
      backgroundColor: theme.dark ? '#1E1E1E' : '#FFFFFF',
      borderTopColor: theme.dark ? '#2C2C2C' : '#F3F4F6',
      borderTopWidth: 1,
      elevation: 0,
    },
    tabBarLabelStyle: {
      fontSize: 11,
      fontWeight: '600',
      marginTop: 2,
    },
  }),
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
})
