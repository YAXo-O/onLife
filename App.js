import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import React, {Node, useCallback, useEffect, useRef} from 'react'
import {NavigationContainer} from '@react-navigation/native';
import {Provider, useDispatch} from 'react-redux'
import {Alert, AppState} from 'react-native';
import {store, persistor} from './src/redux/store';
import {PersistGate} from 'redux-persist/integration/react';
import AppNavigator from './src/navigation/AppNavigator';
import AuthNavigator from './src/navigation/AuthNavigator';
import {useSelector} from 'react-redux';
import {navigationRef} from './src/navigation/RootNavigation';
import messaging from '@react-native-firebase/messaging';
import { notificationMessage, setPushToken, syncEverything, syncTrainingPrograms } from './src/redux/action-creators'

messaging().setBackgroundMessageHandler(async remoteMessage => {
  if (store) {
    store.dispatch(notificationMessage(remoteMessage.data));
  }
});

const NavigationComponent = () => {
  const {token} = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const appState = useRef(AppState.currentState);

  const handleAppState = useCallback(
    nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        dispatch(syncEverything());
      }

      appState.current = nextAppState;
    },
    [appState, dispatch],
  );

  useEffect(() => {
    AppState.addEventListener('change', handleAppState);
    return () => AppState.removeEventListener('change', handleAppState);
  }, [handleAppState]);

  useEffect(() => {
    dispatch(syncTrainingPrograms());
  }, [dispatch]);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
      dispatch(notificationMessage(remoteMessage.data));
    });

    messaging()
      .getToken()
      .then(token => {
        dispatch(setPushToken(token));
      });

    return unsubscribe;
  }, [dispatch]);

  if (token) {
    return <AppNavigator />;
  } else {
    return <AuthNavigator setIsLogin={false} />;
  }
};

const App: () => Node = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer initialRouteName={'AuthStack'} ref={navigationRef}>
          <NavigationComponent />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;
