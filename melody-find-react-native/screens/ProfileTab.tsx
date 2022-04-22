import { StyleSheet, TouchableOpacity, Linking, Pressable, Image, ActivityIndicator } from 'react-native';
import React, { useState, useEffect, Component } from 'react';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, ResponseType, useAuthRequest} from 'expo-auth-session';
import { endpoints } from '../endpoint'
import axios from 'axios';

WebBrowser.maybeCompleteAuthSession();


export default function Profile() {

  const [userData, setUserData] = useState<any>([])
  const [hasDataLoaded, setHasDataLoaded] = useState(false)


async function getValueFor() {
  let result = await SecureStore.getItemAsync('token');
  if (result) {
    return await result;
  } else {
    alert('Login to hear the music');
  }
}


useEffect(() => {
  console.log("Logged from useEffect in Profile !")

  const getProfile = async () => {
    let token = await getValueFor()
  
    axios.get(endpoints.profile, {
      headers: {
        'Authorization': `Bearer ${token}` 
      }
    })
    .then((response) => {
      console.log(response.data)
      setUserData(response.data)
    })
    .then(() => {
      setHasDataLoaded(true)
    })
    .catch((error) => {
      console.log(error)
    })
  };

  // UNCOMMENT
  getProfile();
}, [])
  

  // display data

  return (
    <View style={styles.container}>

      {hasDataLoaded?
      <View>
        <Image source={{uri :userData.images[0].url}} style={styles.image}/>
        <Text>{userData.display_name}</Text>
        <Text>Followers: {userData.followers.total}</Text>
        <Text></Text>
      </View>
      :
      <View>
      <ActivityIndicator size='large' color='#00ff00'/>
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
    width: 150,
    height: 150,
    borderRadius: 50,
  }
});
