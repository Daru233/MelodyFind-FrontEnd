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
import { FontAwesome, MaterialCommunityIcons, FontAwesome5, Ionicons, Entypo, EvilIcons } from '@expo/vector-icons';

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


  return (
      <View style={styles.container}>

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

          const artists = item.track.artists.map((artist: any) => {
            return(
              <Text style={styles.artists} key={artist.id}>{artist.name}</Text>
            )
          })

          return(
            <View style={styles.itemContainer}>
              <View style={styles.songData}>
                <Image source={{uri: item.track.album.images[0].url}} style={styles.image}/>
                <View style={styles.titleWrapper}>
                  <Text adjustsFontSizeToFit={true} style={styles.title}>{item.track.name}</Text>
                </View>
                {artists}
              </View>

              <View style={styles.icons}>
                <MaterialCommunityIcons 
                name='heart'
                color={'white'}
                size={40}
                style={{paddingBottom: 25}}/>

                <MaterialCommunityIcons 
                name='plus'
                color={'white'}
                size={48}/>

              </View>

            </View>
          )
        }}
        />

      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: 'center',
    width: width,
    height: height,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: -1,
    paddingLeft: 30,
    flex: 1,
    flexWrap: 'wrap',
  },
  artists: {
    fontSize: 18,
    paddingLeft: 30,
  },
  itemContainer: {
    flexDirection: 'row',
    flex: 1,
    alignSelf: 'center',
    height: height,
    width: width,
    // marginVertical: 16,
    // marginHorizontal: 16,
    // padding: SPACING,
    backgroundColor: 'blue',
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
    borderRadius: 30,
    alignSelf: 'center',
    borderBottomLeftRadius: 5,
    borderColor: 'white',
  },
  songData: {
    paddingTop: 20,
    // backgroundColor: 'green',
    flex: 10,
  },
  titleWrapper: {
    paddingTop: 10,
    flexDirection: 'row'
  },
  icons: {
    // backgroundColor: 'red',
    flex: 2,
    paddingTop: height * 0.2,
    alignItems: 'center'
  }
   
});
