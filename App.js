import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import type {Node} from 'react';
import {
  AsyncStorage,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import  AppNavigator from './src/navigation/AppNavigator'
import Login from "./src/screens/Login";
import AuthNavigator from "./src/navigation/AuthNavigator";

const App: () => Node = () => {
  const [isLogin, setIsLogin] = useState(false)
  const [token, setToken] = useState('')

  useEffect(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      setToken(token)
    } catch (error) {
      console.log(error);
    }
  }, [])

  console.log('token', token);
  return (
      <NavigationContainer
          initialRouteName={'AuthStack'}>

        {token.length > 0 || isLogin  ? <AppNavigator /> : <AuthNavigator setIsLogin={setIsLogin} /> }

      </NavigationContainer>
  );
};

const styles = StyleSheet.create({

});

export default App;
