import { StyleSheet, TouchableOpacity, Linking, Button, FlatList, Dimensions, SafeAreaView } from 'react-native';
import React, { useState, useEffect, Component } from 'react';
import { Text, View } from '../components/Themed';
import axios from 'axios';

export default function Playback() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <View style={styles.container}>
      {isLoggedIn ?
      <Text style={styles.title}>True</Text>
      :
      <Text style={styles.title}>False</Text>
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
  }
});

