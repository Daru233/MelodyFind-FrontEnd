import { FontAwesome, MaterialCommunityIcons, FontAwesome5, Ionicons, Entypo, EvilIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable } from 'react-native';
import { Text, View } from '../components/Themed';
import axios from 'axios';
import { endpoints } from '../endpoint';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import DiscoverScreen from '../screens/TabOneScreen';
import GenresScreen from '../screens/TabTwoScreen';
import Profile from '../screens/ProfileTab';

import { AuthContext } from './AuthContext';
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

function BottomTabNavigator() {

  const [isLoggedIn, setIsLoggedIn] = useState<Boolean>(true)

  const colorScheme = useColorScheme();


  const [state, dispatch] = React.useReducer(
    (prevState: any, action: any) => {
      switch (action.type) {
        case 'LOGGED_OUT':
          return {
            ...prevState,
            isLoggedIn: false,
            token: null,
          };
        case 'LOGGED_IN':
          return {
            ...prevState,
            isLoggedIn: true,
            token: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isLoggedIn: false,
            token: null,
          };
      }
      },
      {
        isLoggedIn: false,
        userToken: null,
      }
  )

  const loggedIn = useMemo(() => ({isLoggedIn, setIsLoggedIn}), [isLoggedIn, setIsLoggedIn])

  async function set_token(key: string, value: string) {
    await SecureStore.setItemAsync(key, value);
    setIsLoggedIn(true)
  }

  async function set_refresh_token(key: string, value: string) {
    await SecureStore.setItemAsync(key, value);
    setIsLoggedIn(true)
  }

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let token: any;
      let refresh_token: any;

      try {
        token = await SecureStore.getItemAsync('token');
        refresh_token = await SecureStore.getItemAsync('refresh_token');

        // if (typeof token == 'string') {
        //   console.log('CHECKING IF TOKEN IS VALID')
        //   // request /me endopint to check if token is valid
        //   axios.get(endpoints.profile, {
        //     headers: {
        //       'Authorization': `Bearer ${token}` 
        //     }
        //   })
        //   .then((response) => {
        //     console.log(response.status)
        //     if(response.status == 200){
        //       setIsLoggedIn(true)
        //       console.log('token is valid')
        //       dispatch({ type: 'LOGGED_IN', token: token });
        //     }
        //   })
        //   .catch((error) => {
        //     if(error.response.status == 401){
        //       console.log('token is not valid')
        //       dispatch({ type: 'LOGGED_OUT', token: token });
        //     }
        //   })
        // }

        if (token == null){
          dispatch({ type: 'LOGGED_OUT', token: token });
        }


      } catch (e) {
        // Restoring token failed
      }


      
    };

    bootstrapAsync();
  }, []);

    

    return (
      <AuthContext.Provider value={loggedIn}>
        {loggedIn.isLoggedIn ? 
        (<BottomTab.Navigator
          initialRouteName="ProfileTab"
          screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme].tint,
          }}>
          <BottomTab.Screen
          name="DiscoverScreen"
          component={DiscoverScreen}
          options={({ navigation }: RootTabScreenProps<'DiscoverScreen'>) => ({
          headerTitle: (props: any) => <Text style={{paddingLeft: 25, fontSize: 30}}>Discover</Text>,
          title: 'Discover',
          tabBarIcon: ({ color }) => <Entypo name='home' size={30} style={{marginBottom: -2}} color={color}/>,
          })}
          />
          <BottomTab.Screen
          name="GenresScreen"
          component={GenresScreen}
          options={{
            headerTitle: (props: any) => <Text style={{paddingLeft: 25, fontSize: 30}}>Genres</Text>,
            title: 'Genres',
            tabBarIcon: ({ color }) => <EvilIcons name='search' size={30} style={{marginBottom: -2}} color={color} />,
          }}
          />
          <BottomTab.Screen
          name="Profile"
          component={Profile}
          options={{
            headerTitle: (props: any) => <Text style={{paddingLeft: 25, fontSize: 30}}>Profile</Text>,
            title: 'Profile',
            tabBarIcon: ({ color }) => <EvilIcons name='user' size={30} style={{marginBottom: -2}} color={color} />,
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
