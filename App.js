import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import type {Node} from 'react';
import {Provider} from 'react-redux';
import {store, persistor} from './src/redux/store';
import {PersistGate} from 'redux-persist/integration/react';
import AppNavigator from './src/navigation/AppNavigator';
import AuthNavigator from './src/navigation/AuthNavigator';
import {useSelector} from 'react-redux';
import {navigationRef} from './src/navigation/RootNavigation';

const NavigationComponent = () => {
  const {token} = useSelector(state => state.auth);

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
