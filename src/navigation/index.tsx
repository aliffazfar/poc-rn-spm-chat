import {
  createStaticNavigation,
  StaticParamList,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomTabs } from '@/navigation/BottomTabs';
import { ConversationScreen } from '@/screens/ConversationScreen';
import { ContactInfoScreen } from '@/screens/ContactInfoScreen';
import { DetailsScreen } from '@/screens/DetailsScreen';
import { ProfileSheet } from '@/screens/ProfileSheet';

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
        sheetAllowedDetents: 'fitToContents',
        sheetGrabberVisible: true,
      },
    },
  },
});

export const Navigation = createStaticNavigation(RootStack);

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
