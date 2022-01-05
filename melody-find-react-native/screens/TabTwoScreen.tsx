import { StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';


export default function TabTwoScreen() {

  const [has_chosen, set_has_chosen] = useState<Boolean>(false);
  const [category, setCategory] = useState<String>();
  const [has_pressed, set_has_pressed] = useState(false);
  
  const [track_name, set_track_name] = useState();
  const [track_artist, set_track_artist] = useState<any[]>([]);
  const [track_uri, set_track_uri] = useState();

  const setCategoryKpop = () => {
    setCategory("kpop");
    set_has_chosen(true)
  }

  const setCategoryPop = () => {
    setCategory("pop")
    set_has_chosen(true)
  }

  const setCategoryRock = () => {
    setCategory("rock")
    set_has_chosen(true)
  }

  const setCategoryHiphop = () => {
    setCategory("hiphop")
    set_has_chosen(true)
  }

  const artistList = track_artist.map((object) => {
    return(
      <Text key={object['id']}>Artist: {object['name']}</Text>
      // <View></View>
    )
  })

  const getSongFromGenre = () => {
    set_has_pressed(true)
    console.log(category)
    let url_random_song = `https://melody-find.herokuapp.com/mf/v1/song?category=${category}`;
    return fetch(url_random_song, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json)
        set_track_name(json[0].track.name)
        set_track_artist(json[0].track.artists)
        set_track_uri(json[0].track.uri)
      })
      .catch((error) => {
        console.error(error);
      });
  }; 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shuffle from Genre</Text>
      {has_chosen? 
      <View>
        <Text>Genre: {category}</Text>  
        <TouchableOpacity onPress={getSongFromGenre}>
          <Text style={styles.title}>
              Shuffle Genre!
          </Text>
        </TouchableOpacity>
      </View>
      :
       <Text>Choose a category!</Text>}

      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      <View style={styles.genre}>
        <TouchableOpacity onPress={setCategoryKpop}>
            <Text style={styles.title}>
              kpop
            </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={setCategoryPop}>
            <Text style={styles.title}>
              pop
            </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={setCategoryRock}>
            <Text style={styles.title}>
              rock
            </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={setCategoryHiphop}>
            <Text style={styles.title}>
              hiphop
            </Text>
        </TouchableOpacity>
      </View>

      {has_pressed? 
        <View>
        <Text>Title: {track_name}</Text>
        {artistList}
        <Text>Uri: {track_uri}</Text>
        </View>
      : 
        <Text>Click Shuffle!</Text>}

      {/* <EditScreenInfo path="/screens/TabTwoScreen.tsx" /> */}
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

// https://www.youtube.com/watch?v=YmynMyn8o6E&ab_channel=notJust%E2%80%A4dev