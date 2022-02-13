import { Text, View } from '../components/Themed';
import { StyleSheet } from 'react-native';
import { useState } from 'react';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';

export function Song(){

    return(
        <View style={styles.container}>
          <Text>Hello</Text>
        </View>
    )    
}

const styles = StyleSheet.create({
    container: {
      height: '100%',
      width: '100%',
      backgroundColor: 'blue'
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });