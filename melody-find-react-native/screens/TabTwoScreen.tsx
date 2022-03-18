import { StyleSheet, Modal, Alert, Pressable } from "react-native";
import React, { useState } from 'react';
import { Text, View } from '../components/Themed';
import ScrollComponent from '../components/ScrollComponent'


export default function GenresScreen() {

  const [modalVisible, setModalVisible] = useState(false);
  const [chosenGenre, setChosenGenre] = useState('');

  const generateColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0');
    return `#${randomColor}`;
  };


  const GenreContainer = (props: any) => {
    return(
      <Pressable onPress={() => {setModalVisible(!modalVisible); setChosenGenre(props.genre)}}
      style={[styles.genreContainer, {backgroundColor: generateColor()}]}>
      <Text style={styles.genreItem}>
        {props.genre}
      </Text>
      </Pressable>
    )
  }

  const TestComponent = () => {
    return(
      <View>
        <Text>
         This is a test to see if a component can be rendered in a modal
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >

        <View style={styles.centeredView}>
          <Text style={styles.modalText}>Discover {chosenGenre}</Text>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => setModalVisible(!modalVisible)}
          >
            <Text style={styles.textStyle}>back</Text>
          </Pressable>

          <TestComponent />

        </View>

      </ Modal>


      <View style={styles.row}>
          <GenreContainer genre={'toplists'} />
          <GenreContainer genre={'hiphop'} />
        </View>

        <View style={styles.row}>
          <GenreContainer genre={'kpop'}/>
          <GenreContainer genre={'pop'} />
        </View>

        <View style={styles.row}>
          <GenreContainer genre={'workout'} />
          <GenreContainer genre={'edm_dance'} />
        </View>

        <View style={styles.row}>
          <GenreContainer genre={'alternative'} />
          <GenreContainer genre={'rock'} />
        </View>

        <View style={styles.row}>
          <GenreContainer genre={'gaming'} />
          <GenreContainer genre={'punk'} />
        </View>

        <View style={styles.row}>
          <GenreContainer genre={'mood'} />
          <GenreContainer genre={'latin'} />
        </View>

        <View style={styles.row}>
          <GenreContainer genre={'indie_alt'} />
          <GenreContainer genre={'fresh_finds'} />
        </View>

        <View style={styles.row}>
          <GenreContainer genre={'country'} />
          <GenreContainer genre={'classical'} />
        </View>

        <View style={styles.row}>
          <GenreContainer genre={'soul'} />
          <GenreContainer genre={'metal'} />
        </View>

        <View style={styles.row}>
          <GenreContainer genre={'jazz'} />
          <GenreContainer genre={'throwback'} />
        </View>

        <View style={styles.row}>
          <GenreContainer genre={'rnb'} />
          <GenreContainer genre={'alt'} />
        </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  genreContainer: {
    padding: 8,
    paddingHorizontal: 50,
    margin: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    minHeight: '5%',
    minWidth: '45%',
    // backgroundColor: 'green'
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
  },
  genreItem: {
    fontSize: 18
  },
  row: {
    flexDirection: 'row'
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    fontSize: 16,
    marginHorizontal: 20,
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalText: {
    fontSize: 32,
    marginBottom: 24,
    textAlign: "center"
  },
});
