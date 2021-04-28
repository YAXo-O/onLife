import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import  AppNavigator from './src/navigation/AppNavigator'

const App: () => Node = () => {

  return (
      <NavigationContainer
          initialRouteName={'AuthStack'}>
          <AppNavigator />
      </NavigationContainer>
  );
};

const styles = StyleSheet.create({

});

export default App;
