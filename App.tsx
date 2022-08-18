import React from 'react';
import { SafeAreaView, StatusBar, View, StyleSheet, Text, ActivityIndicator, } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { Store } from 'redux';
import { Persistor } from 'redux-persist/es/types';
import { PersistGate } from 'redux-persist/integration/react';

import { MainScreen } from './src/screens/Main';
import { getStore, IState, getPersistor } from './src/store/IState';
import { CounterState } from './src/store/CounterState/State';
import { IncrementCounterAction, CounterActionType } from './src/store/CounterState/Actions';

/* Counter is used to test persistent store */
const Counter: React.FC = () => {
	const counter = useSelector<IState, CounterState>((state: IState) => state.counter);
	const dispatch = useDispatch();

	React.useEffect(() => {
		const action: IncrementCounterAction = {
			type: CounterActionType.Increment,
			payload: undefined,
		};
		dispatch(action);
	}, [dispatch]);

	return (
		<View style={{ paddingVertical: 2, paddingHorizontal: 4 }}>
			<Text style={{ color: '#c5c5c5' }}>
				<Text style={{ fontWeight: 'bold', color: '#c5c5c5' }}>
					Counter:
				</Text> {counter.counter}
			</Text>
		</View>
	);
};

// Store should never be changed - so it's ok to call getStore() and getPersistor() only once
const store: Store<IState> = getStore();
const persistor: Persistor = getPersistor();

const App = () => (
	<View style={styles.app}>
		<NavigationContainer>
			<SafeAreaView style={{ flex: 1 }}>
				<StatusBar />
				<Provider store={store}>
					<PersistGate loading={<ActivityIndicator />} persistor={persistor}>
						<MainScreen />
					</PersistGate>
				</Provider>
			</SafeAreaView>
		</NavigationContainer>
	</View>
);

const styles = StyleSheet.create({
	app: {
		flex: 1,
		backgroundColor: '#1a4d83'
	},
});

export default App;
