import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);
const dbName = "bioconnect.db"; 

const SplashPage = ({ navigation }) => {
  useEffect(() => {
    // SQLite.deleteDatabase({ name: dbName, location: 'default' })
    const timer = setTimeout(() => {
      navigation.replace('Search');
    }, 1000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../images/Bioconnect.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f6f2db',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
});

export default SplashPage;