import { StyleSheet, TouchableOpacity, Linking, Pressable, Image } from 'react-native';
import React, { useState, useEffect, Component } from 'react';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, ResponseType, useAuthRequest} from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};


export default function TabTwoScreen() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileData, setProfileData] = useState<any>({'':''});

  async function setToken(key: string, value: string) {
    await SecureStore.setItemAsync(key, value);
  }
  
  async function checkToken() {
    SecureStore.getItemAsync('token')
    .then((token) => {
      let meUrl = `https://melody-find.herokuapp.com/me/${token}`
    fetch(meUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((response) => response.json())
    .then((json) => {
      if(json[1] == 401){
        // promptAsync()
        console.log("prompt async")
      } 
       
      if(json[1] == 200){
        setProfileData(json[0])
      }
      console.log(json)

    })
    .then(() => {

    })
    .catch((error) => {
      console.log(error)
    })

    })

  }
  
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
          setToken('token', response['access_token']);
          console.log(response['access_token'])
          return response;
        })
        .catch(error => console.log(error))
      }

  }, [response]);

  return (
    <View style={styles.container}>


      {isLoggedIn? 

      <View>
        <Text>Hey, {profileData.response.display_name}</Text>
        <Image source={{uri: profileData.response.images[0].url}} style={styles.image}/>
      </View>
      
      : 

      <View>
        <Pressable style={styles.button} disabled={!request} onPress={() => {
        checkToken();
        }}>
        <Text style={styles.text}>Log In</Text>
        </Pressable>

        <Pressable style={styles.button} disabled={!request} onPress={() => {
        promptAsync();
        }}>
        <Text style={styles.text}>Get Token dev only</Text>
        </Pressable>
      </View> 

      }

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
  text: {
    fontSize: 26,
    // fontWeight: 'bold',
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
  image: {
    width: 260,
    height: 260,
    borderRadius: 50,
  }
});
