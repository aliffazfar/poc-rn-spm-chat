import {
  createStaticNavigation,
  StaticParamList,
  DefaultTheme,
  DarkTheme,
  Theme,
} from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { BottomTabs } from '@/navigation/BottomTabs'
import { ConversationScreen, ContactInfoScreen } from '@/screens/chat'
import { DetailsScreen } from '@/screens/home'
import { ProfileSheet } from '@/screens/account'
import { colors } from '@/theme'

export const appLightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.light.background,
    card: colors.light.card,
    text: colors.light.text,
    border: colors.light.border,
  },
}

export const appDarkTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.dark.background,
    card: colors.dark.card,
    text: colors.dark.text,
    border: colors.dark.border,
  },
}

const RootStack = createNativeStackNavigator({
  screens: {
    Main: {
      screen: BottomTabs,
      options: {
        headerShown: false,
      },
    },
    Conversation: {
      screen: ConversationScreen,
      options: {
        headerShown: false,
        animation: 'slide_from_right',
      },
    },
    ContactInfo: {
      screen: ContactInfoScreen,
      options: {
        headerShown: false,
        animation: 'slide_from_right',
      },
    },
    Details: {
      screen: DetailsScreen,
      options: {
        title: 'Details',
      },
    },
    Profile: {
      screen: ProfileSheet,
      options: {
        presentation: 'formSheet',
        headerShown: false,
        sheetAllowedDetents: [0.75, 1.0] as any,
        sheetGrabberVisible: true,
        sheetCornerRadius: 28,
      },
    },
  },
})

export const Navigation = createStaticNavigation(RootStack)

type RootStackParamList = StaticParamList<typeof RootStack>

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
