/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome, MaterialCommunityIcons, FontAwesome5, Ionicons, Entypo, EvilIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import DiscoverScreen from '../screens/TabOneScreen';
import GenresScreen from '../screens/TabTwoScreen';
import ProfileTab from '../screens/ProfileTab';
import Playback from '../screens/Playback';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
// import LinkingConfiguration from './LinkingConfiguration';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      // linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
      <BottomTab.Navigator
        initialRouteName="DiscoverScreen"
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme].tint,
        }}>
      <BottomTab.Screen
        name="DiscoverScreen"
        component={DiscoverScreen}
        options={({ navigation }: RootTabScreenProps<'DiscoverScreen'>) => ({
          title: 'Discover',  
          tabBarIcon: ({ color }) => <Entypo name='home' size={30} style={{marginBottom: -2}} color={color}/>,
        })}
      />
      <BottomTab.Screen
        name="GenresScreen"
        component={GenresScreen}
        options={{
          title: 'Genres',
          tabBarIcon: ({ color }) => <EvilIcons name='search' size={30} style={{marginBottom: -2}} color={color} />,
        }}
      />
      <BottomTab.Screen
        name="ProfileTab"
        component={ProfileTab}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <EvilIcons name='user' size={30} style={{marginBottom: -2}} color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Playback"
        component={Playback}
        options={{
          title: 'Playback',
          tabBarIcon: ({ color }) => <EvilIcons name='gear' size={30} style={{marginBottom: -2}} color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}
