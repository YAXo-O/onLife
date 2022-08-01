import React from 'react';
import {
	SafeAreaView,
	StatusBar, View, StyleSheet,
} from 'react-native';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';

import { itemReducer } from './src/store/ItemState/Reducer';
import { MainScreen } from './src/screens/Main';

const store = createStore(itemReducer, applyMiddleware(thunk));

const App = () => {
	return (
		<View style={styles.app}>
			<NavigationContainer>
				<SafeAreaView style={{ flex: 1 }}>
					<StatusBar />
					<Provider store={store}>
						<MainScreen />
					</Provider>
				</SafeAreaView>
			</NavigationContainer>
		</View>
	);
};

const styles = StyleSheet.create({
	app: {
		flex: 1,
		backgroundColor: '#749aa3'
	},
});

export default App;
