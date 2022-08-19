import React from 'react';
import {
	StatusBar,
	View,
	StyleSheet,
	ActivityIndicator,
} from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { Persistor } from 'redux-persist/es/types';
import { PersistGate } from 'redux-persist/integration/react';

import { MainScreen } from './src/screens/Main';
import { getStore, IState, getPersistor } from './src/store/IState';

// Store should never be changed - so it's ok to call getStore() and getPersistor() only once
const store: Store<IState> = getStore();
const persistor: Persistor = getPersistor();

const theme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme,
		background: 'transparent',
	},
};

const App = () => (
	<View style={styles.app}>
		<NavigationContainer theme={theme}>
			<StatusBar barStyle="dark-content" />
			<Provider store={store}>
				<PersistGate loading={<ActivityIndicator />} persistor={persistor}>
					<MainScreen />
				</PersistGate>
			</Provider>
		</NavigationContainer>
	</View>
);

const styles = StyleSheet.create({
	app: {
		flex: 1,
		backgroundColor: '#103152',
	},
});

export default App;
