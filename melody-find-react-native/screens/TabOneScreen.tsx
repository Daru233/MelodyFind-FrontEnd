import { Alert, StyleSheet, TouchableOpacity, FlatList, Dimensions, Image } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { Song } from '../components/SongComponent'
import { RootTabScreenProps } from '../types';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useDerivedValue, useSharedValue, withSpring } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
const OVERFLOW_HEIGHT = 70;
const SPACING = 10;
const ITEM_WIDTH = width * 0.8;
const ITEM_HEIGHT = ITEM_WIDTH * 1.7

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {

const [track_name, set_track_name] = useState();
const [track_artist, set_track_artist] = useState<any[]>([]);
const [track_uri, set_track_uri] = useState();
const [has_pressed, set_has_pressed] = useState(false);
const [songData, setSongData] = useState();

useEffect(() => {
  console.log("Logged from useEffect !")
  getSongs()
}, [])


const getSongs = () => {
  let url_random_song = "https://melody-find.herokuapp.com/mf/v1/song"
  let url_dev_server = 'http://127.0.0.1:5000/mf/v1/song'
  return fetch(url_random_song, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
    .then((response) => response.json())
    .then((json) => {
      // console.log(json)
      // set_track_name(json[0].track.name)
      // set_track_artist(json[0].track.artists)
      // console.log(json[0].track.artists)
      // set_track_uri(json[0].track.uri)
      setSongData(json[0])
      // console.log(json[1])
      console.log('REQUESTING DATA')
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


  const DATA = [
    {
      title: 'Afro vibes',
      location: 'Mumbai, India',
      date: 'Nov 17th, 2020',
      poster:
        'https://www.creative-flyers.com/wp-content/uploads/2020/07/Afro-vibes-flyer-template.jpg',
    },
    {
      title: 'Jungle Party',
      location: 'Unknown',
      date: 'Sept 3rd, 2020',
      poster:
        'https://www.creative-flyers.com/wp-content/uploads/2019/11/Jungle-Party-Flyer-Template-1.jpg',
    },
    {
      title: '4th Of July',
      location: 'New York, USA',
      date: 'Oct 11th, 2020',
      poster:
        'https://www.creative-flyers.com/wp-content/uploads/2020/06/4th-Of-July-Invitation.jpg',
    },
    {
      title: 'Summer festival',
      location: 'Bucharest, Romania',
      date: 'Aug 17th, 2020',
      poster:
        'https://www.creative-flyers.com/wp-content/uploads/2020/07/Summer-Music-Festival-Poster.jpg',
    },
    {
      title: 'BBQ with friends',
      location: 'Prague, Czech Republic',
      date: 'Sept 11th, 2020',
      poster:
        'https://www.creative-flyers.com/wp-content/uploads/2020/06/BBQ-Flyer-Psd-Template.jpg',
    },
    {
      title: 'Festival music',
      location: 'Berlin, Germany',
      date: 'Apr 21th, 2021',
      poster:
        'https://www.creative-flyers.com/wp-content/uploads/2020/06/Festival-Music-PSD-Template.jpg',
    },
    {
      title: 'Beach House',
      location: 'Liboa, Portugal',
      date: 'Aug 12th, 2020',
      poster:
        'https://www.creative-flyers.com/wp-content/uploads/2020/06/Summer-Beach-House-Flyer.jpg',
    },
  ];


  return (
      <View style={styles.container}>

        {/* <GestureDetector gesture={gesture}> */}

        <FlatList 
        data={songData}
        keyExtractor={(_, index) => String(index)}
        inverted
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        snapToInterval={height}
        snapToAlignment={'start'}
        decelerationRate={'fast'}
        renderItem={({item, index}) => {

          console.log(item.track.album.images[0].url)

          return(
            <View style={styles.itemContainer}>
              <Image source={{uri: item.track.album.images[0].url}} style={styles.image}/>
              <Text style={styles.title}>{item.track.name}</Text>
              <Text style={styles.data}>{item.track.artists[0].name}</Text>
              {/* <Text style={styles.data}>{item.track.artists}</Text> */}
            </View>
          )
        }}
        />

        {/* </GestureDetector> */}


        {/* <Text style={styles.title}>Melody Find</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />


        <TouchableOpacity onPress={getMoviesFromApi}>
        <Text style={styles.title}>
        Shuffle!
        </Text>
        </TouchableOpacity>z

        {has_pressed? 
        <View style={styles.randomSongResult}>
        <Text>Title: {track_name}</Text>
        {artistList}
        <Text>Uri: {track_uri}</Text>
        </View>
        : 
        <Text>Click Shuffle!</Text>} */}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: 'center',
    width: width,
    height: height
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: -1,
    alignSelf: 'center'
  },
  location: {
    fontSize: 16,
  },
  data: {
    fontSize: 20,
    alignSelf: 'center'
  },
  itemContainer: {
    // flex: 1,
    // position: 'absolute',
    alignSelf: 'center',
    height: height,
    width: width,
    // marginVertical: 16,
    marginHorizontal: 16,
    padding: SPACING * 2,
    // backgroundColor: 'blue'
  },
  itemContainerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overflowContainer: {
    height: OVERFLOW_HEIGHT,
    overflow: 'hidden',
  },
  image: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    borderRadius: 25,
    alignSelf: 'center'
  }
   
});
