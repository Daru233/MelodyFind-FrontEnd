import { StyleSheet, TouchableOpacity, Linking, Button, FlatList, Dimensions, SafeAreaView, Pressable, TouchableNativeFeedback } from 'react-native';
import React, { useState, useEffect, Component } from 'react';
import { Text, View } from '../components/Themed';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { AuthContext } from '../navigation/AuthContext';
import { makeRedirectUri, ResponseType, useAuthRequest} from 'expo-auth-session';

export default function SignIn() {

  const { isLoggedIn, setIsLoggedIn }: any = React.useContext(AuthContext)

  const discovery = {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
  };

  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Code,
      clientId: 'fd131b024b8b40a998aecdaba339a2af',
      scopes: ['user-read-email', 'playlist-modify-public', 'user-read-playback-state', 'user-modify-playback-state', 'user-library-read', 'user-top-read'],
      // In order to follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
      // this must be set to false
      usePKCE: false,
      redirectUri: makeRedirectUri({
        scheme: 'exp://192.168.0.4:19000/'
        }),
    },
    discovery
  );

  async function setToken(key: string, value: string) {
    await SecureStore.setItemAsync(key, value);
    setIsLoggedIn(true)
  }

  React.useEffect(() => {
    if (response?.type === 'success') {
      console.log(response)
      const { code } = response.params;
        fetch(`https://melody-find.herokuapp.com/exchange/${code}`, {method: 'GET'})
        .then((response) => {
          return response.text()
        })
        .then((response) => {
          return JSON.parse(response)
        })
        .then(response => {
          setToken('token', response['access_token']);
          console.log(response['access_token'])
          return response;
        })
        .catch(error => console.log(error))
      }

  }, [response]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Melody Find
      </Text>
      <View style={styles.horizontalLine} />

      <Pressable style={styles.button}
      onPress={() => {promptAsync();}}>
        <Text style={styles.paragraph}>
          Connect with Spotify
        </Text>
      </Pressable>

      {/* <Text style={styles.paragraph}>Connect to your Spotify Account</Text> */}
    </View>
  );
}

const styles = StyleSheet.create({ 
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  paragraph: {
    fontSize: 24,
  },
  button:{
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 32,
    borderRadius: 6,
    elevation: 3,
    borderColor: '#1DB954',
    borderWidth: 2,
    marginBottom: 30
    // backgroundColor: 'blue',
  },
  horizontalLine:{
    backgroundColor: 'grey',
    height: 2,
    width: 200,
    marginTop: 40,
    marginBottom: 40
  },
  pressIn: {
    backgroundColor: 'green',
  }
});

