import { StyleSheet, TouchableOpacity, Linking, Button } from 'react-native';
import React, { useState, useEffect, Component } from 'react';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';

import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, ResponseType, useAuthRequest} from 'expo-auth-session';

// import base64 from 'react-native-base64'
// import { withSafeAreaInsets } from 'react-native-safe-area-context';
// import { CONSTANTS } from '../CONSTANTS';


WebBrowser.maybeCompleteAuthSession();

// Endpoint
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
      scopes: ['user-read-email', 'playlist-modify-public'],
      // In order to follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
      // this must be set to false
      usePKCE: false,
      redirectUri: makeRedirectUri({
        scheme: 'exp://192.168.0.4:19000/'
        }),
    },
    discovery
  );

  
  // const getTokenUsingCode = () => {
  //   try{

  //     const auth = base64.encode(`${CLIENT_ID}` + ':' + `${CLIENT_SECRET}`)
  //     console.log(auth)
  //     console.log("LOGGING CODE")
  //     console.log(code)

  //     // let data = new URLSearchParams();
  //     // data.append('grant_type', 'authorization_code');
  //     // data.append('code', `${code}`);
  //     // data.append('redirect_uri', 'exp://192.168.0.4:19000/');

  //     var data: any = {
  //       "grant_type": "authorization_code",
  //       "code": `${code}`,
  //       "redirect_uri": "exp://192.168.0.4:19000/"
  //     }

  //     let formBody = "grant_type=authorization_code";
  //     formBody += "&code=" + `${code}`
  //     formBody += "&redirect_uri=" + `exp://192.168.0.4:19000/`
  //     formBody += "&client_id=" + CLIENT_ID
  //     formBody += "&client_secret=" + CLIENT_SECRET 

  //     // let headers = new Headers();
  //     // headers.append('Content-Type', 'application/x-www-form-urlencoded');
  //     // headers.append('Authorization', 'Basic ' + `ZmQxMzFiMDI0YjhiNDBhOTk4YWVjZGFiYTMzOWEyYWY6NzM2OTQ0OWZmNGE4NDYyZjk3ZWRkOGJjMTUzNjY3NTc`)

  //     console.log("REQUESTING TOKEN")

  //     fetch('https://accounts.spotify.com/api/token', {
  //       method: 'POST',
  //       headers: {
  //         'Accept': 'application/json',
  //         'Content-Type': 'application/x-www-form-urlencoded',
  //         'Authorization': 'Basic ZmQxMzFiMDI0YjhiNDBhOTk4YWVjZGFiYTMzOWEyYWY6NzM2OTQ0OWZmNGE4NDYyZjk3ZWRkOGJjMTUzNjY3NTc'
  //       },
  //       body: formBody
  //     })
  //     .then(response => {
  //       console.log("BEFORE STRINGIFY")
  //       console.log('Response: ', JSON.stringify(response)) 
  //     })


  //   }catch(error){
  //     console.log(error)
  //   }
  // }
  
  React.useEffect(() => {
    if (response?.type === 'success') {
      console.log(response)
      const { code } = response.params;
        set_code(code)
      }
  }, [response]);


  const logToken = () => {
    fetch(`https://melody-find.herokuapp.com/exchange/${code}`, {method: 'GET'})
    .then((response) => {
      return response.text()
    })
    .then(response => {
      return console.log(response)
    })
    .catch(error => console.log(error))
  }

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
          logToken();
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
