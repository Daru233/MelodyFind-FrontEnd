import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import * as WebBrowser from 'expo-web-browser';
import { useCallback } from 'react';
import { Dimensions, FlatList, Pressable, StyleSheet, TouchableOpacity, Image, Modal, SafeAreaView, ActivityIndicator, Alert} from 'react-native';

import Colors from '../constants/Colors';
import { endpoints } from '../endpoint';
import { MonoText } from './StyledText';
import { Text, View } from './Themed';
import { useState } from 'react';
import * as SecureStore from 'expo-secure-store';

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
const OVERFLOW_HEIGHT = 70;
const SPACING = 10;
const ITEM_WIDTH = width * 0.8;
const ITEM_HEIGHT = ITEM_WIDTH * 1.7

export default function ScrollComponent(data: any) {

const [userPlaylists, setUserplaylists] = useState()
const [hasPlaylistLoaded, setHasPlaylistLoaded] = useState(false)
const [currentTrack, setCurrentTrack] = useState('');
const [heartPressed, setHeartPressed] = useState(false);
const [hasLiked, setHasLiked] = useState<Array<string>>([''])
const [modalVisible, setModalVisible] = useState(false);

const onViewableItemsChanged = useCallback(({viewableItems, changed}) => {
    setHeartPressed(false)
    setModalVisible(false)
    setCurrentTrack(viewableItems[0].item.uri)
    // console.log(currentTrack)
    setTimeout(() => {
        playTrack(viewableItems[0].item.uri)
    }, 2500)
    
    },[])


  async function get_playlists(){
    let token = await getValueFor()
  
    axios.get(endpoints.playlist, {
        headers: {
        'Authorization': `Bearer ${token}` 
        }
    })
    .then((response) => {
      console.log(response.data)
      setUserplaylists(response.data)
      setHasPlaylistLoaded(true)
    })
    .then(() => {
      setModalVisible(true)
    })
    .catch((error) => {
        console.log(error)
    })
  }


async function saveTrack(){
  let token = await getValueFor()
  console.log('CURRENT TRACK: ' + currentTrack)

  axios.get(endpoints.save + '/' + currentTrack.toString(), {
      headers: {
      'Authorization': `Bearer ${token}` 
      }
  })
  .then((response) => {
      setHeartPressed(true)
  })
  .catch((error) => {
      console.log(error)
  })
}


async function addTrackToPlayList(playlistId: any, currentTrack: string){
  let token = await getValueFor()
  console.log('CURRENT TRACK: ' + currentTrack)

  axios.get(endpoints.add_to_playlist + '/' + playlistId + '/' + currentTrack, {
      headers: {
      'Authorization': `Bearer ${token}` 
      }
  })
  .then((response) => {
    
  })
  .catch((error) => {
      console.log(error)
  })
}


  function RenderPlaylist(){
    return(
      <SafeAreaView>
        <FlatList 
        data={userPlaylists}
        renderItem={({item}) => 
        <View style={styles.playlisRenderStyle}>
          <Pressable
          onPress={() => {
            console.log(item.id);
            console.log(currentTrack)
            addTrackToPlayList(item.id, currentTrack)
            Alert.alert('Success' ,`added to ${item.name}`)
            setModalVisible(false)
          }}
          >
          <Text style={styles.textStyle}>{item.name}</Text>
          </Pressable>
        </View>}
        />
      </SafeAreaView>
    )
  }

  return (
    <View style={styles.container}>

      <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >

      <SafeAreaView style={styles.playlistContainer}>
        <Pressable
          style={[styles.button, styles.buttonClose]}
          onPress={() => {setModalVisible(!modalVisible);}}
        >
          <Text style={styles.textStyle}>back</Text>
        </Pressable>
        {hasPlaylistLoaded?
        <RenderPlaylist />
        :
        <ActivityIndicator size='large' color='#00ff00'/>}
        
        

      </SafeAreaView>

    </ Modal>


    <FlatList 
    data={data.data}
    keyExtractor={(_, index) => String(index)}
    showsHorizontalScrollIndicator={false}
    showsVerticalScrollIndicator={false}
    snapToInterval={height}
    snapToAlignment={'start'}
    decelerationRate={'fast'}
    onViewableItemsChanged={onViewableItemsChanged}
    viewabilityConfig={viewabilityConfig}
    renderItem={({item, index}) => {

      const artists = item.artists.map((artist: any) => {
        return(
          <Text style={styles.artists} key={artist.id}>{artist.name}</Text>
        )
      })

      return(
        <View style={styles.itemContainer}>
          <View style={styles.songData}>
            <Image source={{uri: item.album.images[0].url}} style={styles.image}/>
            <View style={styles.titleWrapper}>
              <Text adjustsFontSizeToFit={true} style={styles.title}>{item.name}</Text>
            </View>
            {artists}
          </View>

          <View style={styles.icons}>

            <Pressable onPress={() => {
              saveTrack(); 
              }}>
              {heartPressed?
              <MaterialCommunityIcons 
              name='heart'
              color={'red'}
              size={40}
              style={{paddingBottom: 25}}/>
              :
              <MaterialCommunityIcons 
              name='heart'
              color={'white'}
              size={40}
              style={{paddingBottom: 25}}/>}
            </Pressable>

            <Pressable onPress={() => {
              console.log('Pressed Plus');
              get_playlists();
              }}>
              <MaterialCommunityIcons 
              name='plus'
              color={'white'}
              size={48}
              style={{paddingBottom: 25}}/>
            </Pressable>

            <Pressable onPress={() => {
              console.log('Play/Pause Track');
              }}>
              <MaterialCommunityIcons 
              name='play'
              color={'white'}
              size={48}/>
            </Pressable>

          </View>
        </View>
      )
    }}
    />

  </View>
  );
}

  const viewabilityConfig = {itemVisiblePercentThreshold: 50}

  async function getValueFor() {
    let result = await SecureStore.getItemAsync('token');
    console.log(result)
    if (result) {
        return await result;
    } else {
        alert('Login to hear the music');
    }
  }


  async function playTrack(uri: string){
    let token = await getValueFor()
    axios.get(endpoints.playback + '/' + uri, {
        headers: {
        'Authorization': `Bearer ${token}` 
        }
    })
    .then((response) => {
        // console.log(response)
    })
    .catch((error) => {
        // console.log(error)
    })
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
      paddingTop: height * 0.3,
      alignItems: 'center'
    },
    playlistContainer: {
      marginTop: 10,
      marginBottom: height / 2,
      // flexDirection: 'row',
      flex: 1,
      alignSelf: 'flex-end',
      height: height,
      width: width/2,
      marginVertical: 16,
      marginHorizontal: 16,
      // padding: SPACING,
      backgroundColor: '#202124',
      borderRadius: 30
    },
    textStyle: {
      marginTop: 8,
      fontSize: 16,
      marginHorizontal: 20,
      color: "white",
      fontWeight: "bold",
      textAlign: "center",
    },
    playlisRenderStyle: {
      marginTop: 20,
      fontWeight: "bold",
      textAlign: "center",
      backgroundColor: '#35363A',
      borderRadius: 30
    },
    button: {
      borderRadius: 20,
      marginHorizontal: 20,
      elevation: 2
    },
    buttonOpen: {
      backgroundColor: "#F194FF",
    },
    buttonClose: {
      backgroundColor: "#2196F3",
    },
    
     
  });