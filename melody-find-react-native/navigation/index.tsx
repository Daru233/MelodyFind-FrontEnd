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
import SignIn from '../screens/SignInScreen';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import { useState, useReducer, useMemo } from 'react';
import * as SecureStore from 'expo-secure-store';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
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
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();
export const AuthContext = React.createContext(null!);

function BottomTabNavigator() {

  const [isLoggedIn, setIsLoggedIn] = useState<Boolean>(false)

  const colorScheme = useColorScheme();


  const [state, dispatch] = React.useReducer(
    (prevState: any, action: any) => {
      switch (action.type) {
        case 'LOGGED_OUT':
          return {
            ...prevState,
            isLoggedIn: false,
            userToken: null,
          };
        case 'LOGGED_IN':
          return {
            ...prevState,
            isLoggedIn: true,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isLoggedIn: false,
            userToken: null,
          };
      }
      },
      {
        isLoggedIn: false,
        userToken: null,
      }
  )

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await SecureStore.getItemAsync('token');

        if (userToken == null){
          dispatch({ type: 'SIGN_IN', token: userToken });
        }

        if (userToken) {
          // request /me endopint to check if token is valid
          console.log('TOKEN EXISTS')
        }


      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      
    };

    bootstrapAsync();
  }, []);

    const loggedIn = useMemo(() => ({isLoggedIn, setIsLoggedIn}), [isLoggedIn, setIsLoggedIn])

    return (
      <AuthContext.Provider value={loggedIn}>
        {loggedIn.isLoggedIn ? 
        (<BottomTab.Navigator
          initialRouteName="ProfileTab"
          screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme].tint,
          }}>
          {/* <BottomTab.Screen
          name="DiscoverScreen"
          component={DiscoverScreen}
          options={({ navigation }: RootTabScreenProps<'DiscoverScreen'>) => ({
          title: 'Discover',  
          tabBarIcon: ({ color }) => <Entypo name='home' size={30} style={{marginBottom: -2}} color={color}/>,
          })}
          /> */}
          <BottomTab.Screen
          name="GenresScreen"
          component={GenresScreen}
          options={{
            title: 'Genres',
            tabBarIcon: ({ color }) => <EvilIcons name='search' size={30} style={{marginBottom: -2}} color={color} />,
          }}
        />
          </BottomTab.Navigator>) 
        :
        (<BottomTab.Navigator
          initialRouteName="SignIn"
          screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme].tint,
          }}>
          <BottomTab.Screen
          name="SignIn"
          component={SignIn}
          options={{
            title: 'Sign In',
            tabBarIcon: ({ color }) => <EvilIcons name='user' size={30} style={{marginBottom: -2}} color={color} />,
          }}
          />
          </BottomTab.Navigator>)}
      </AuthContext.Provider>
    )
  

//   <BottomTab.Navigator
//   initialRouteName="DiscoverScreen"
//   screenOptions={{
//     tabBarActiveTintColor: Colors[colorScheme].tint,
//   }}>
{/* <BottomTab.Screen
  name="DiscoverScreen"
  component={DiscoverScreen}
  options={({ navigation }: RootTabScreenProps<'DiscoverScreen'>) => ({
    title: 'Discover',  
    tabBarIcon: ({ color }) => <Entypo name='home' size={30} style={{marginBottom: -2}} color={color}/>,
  })}
/>  */}
// <BottomTab.Screen
//   name="GenresScreen"
//   component={GenresScreen}
//   options={{
//     title: 'Genres',
//     tabBarIcon: ({ color }) => <EvilIcons name='search' size={30} style={{marginBottom: -2}} color={color} />,
//   }}
// />
// <BottomTab.Screen
//   name="ProfileTab"
//   component={ProfileTab}
//   options={{
//     title: 'Profile',
//     tabBarIcon: ({ color }) => <EvilIcons name='user' size={30} style={{marginBottom: -2}} color={color} />,
//   }}
// />
// <BottomTab.Screen
//   name="Playback"
//   component={Playback}
//   options={{
//     title: 'Playback',
//     tabBarIcon: ({ color }) => <EvilIcons name='gear' size={30} style={{marginBottom: -2}} color={color} />,
//   }}
// />
// </BottomTab.Navigator>

  
}
