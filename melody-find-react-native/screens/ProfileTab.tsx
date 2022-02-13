import { StyleSheet, TouchableOpacity, Linking, Button } from 'react-native';
import React, { useState, useEffect, Component } from 'react';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import * as SecureStore from 'expo-secure-store';

import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, ResponseType, useAuthRequest} from 'expo-auth-session';

// import base64 from 'react-native-base64'
// import { withSafeAreaInsets } from 'react-native-safe-area-context';
// import { CONSTANTS } from '../CONSTANTS';

async function setToken(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

async function getToken(key: string) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    console.log(result)
    return result
  } else {
    console.log('token not found')
  }
}

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

// const CLIENT_ID = CONSTANTS.CLIENT_ID
// const CLIENT_SECRET = CONSTANTS.CLIENT_SECRET

export default function TabTwoScreen() {

  // will be stored more securely, this is for prototype demo only
  const [request_token, set_request_token] = useState('')
  const [code, set_code] = useState("");
  
  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Code,
      clientId: 'fd131b024b8b40a998aecdaba339a2af',
      scopes: ['user-read-email', 'playlist-modify-public', 'user-read-playback-state', 'user-modify-playback-state'],
      // In order to follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
      // this must be set to false
      usePKCE: false,
      redirectUri: makeRedirectUri({
        scheme: 'exp://192.168.0.4:19000/'
        }),
    },
    discovery
  );


  // after code is returned
  // automatically exchange the code for the access and refresh token
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
          // return console.log(response)
          setToken('access_token', response['access_token'])
          setToken('refresh_token',  response['refresh_token'])
          return response;
        })
        .catch(error => console.log(error))
      }

  }, [response]);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <Button
        disabled={!request}
        title="Login"
        onPress={() => {
          promptAsync();
          }}
      />

      <Button
        title="log token"
        onPress={() => {
          getToken('access_token')
        }}
      />



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
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  genre: {
    alignItems: 'baseline',
    justifyContent: 'space-evenly'
  }
});
