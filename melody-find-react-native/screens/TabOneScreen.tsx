import { Alert, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

import {
  auth as SpotifyAuth,
  remote as SpotifyRemote,
  ApiScope,
  ApiConfig,
} from "react-native-spotify-remote";


export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {


const [track_name, set_track_name] = useState();
const [track_artist, set_track_artist] = useState<any[]>([]);
const [track_uri, set_track_uri] = useState();
const [has_pressed, set_has_pressed] = useState(false);

const getMoviesFromApi = () => {
  let song_url = "http://192.168.0.4:5000/mf/v1/song"
  let movies_url = 'https://reactnative.dev/movies.json'
  let url_home = "https://melody-find.herokuapp.com/"
  let url_random_song = "https://melody-find.herokuapp.com/mf/v1/song"
  return fetch(url_random_song, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
    .then((response) => response.json())
    .then((json) => {
      set_track_name(json[0].track.name)
      set_track_artist(json[0].track.artists)
      console.log(json[0].track.artists)
      set_track_uri(json[0].track.uri)
      set_has_pressed(true)
    }).then(() => {

    })
    .catch((error) => {
      console.error(error);
    });
};


  const artistList = track_artist.map((object) => {
    return(
      <Text key={object['id']}>Artist: {object['name']}</Text>
      // <View></View>
    )
  })


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Melody Find</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <TouchableOpacity onPress={getMoviesFromApi}>
          <Text style={styles.title}>
            Shuffle!
          </Text>
      </TouchableOpacity>

      {has_pressed? 
        <View style={styles.randomSongResult}>
        <Text>Title: {track_name}</Text>
        {artistList}
        <Text>Uri: {track_uri}</Text>
        </View>
      : 
        <Text>Click Shuffle!</Text>}
    </View>
  );
}

function alert() {
  console.log("You pressed a Button")
  Alert.alert("Title", "You pressed a touchable!")
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
  randomSongResult: {
    marginTop: '5%'
  }
});
